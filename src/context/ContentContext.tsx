import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Content, ContentType } from '../types/content';

interface ContentContextType {
  contents: Content[];
  addContent: (content: Omit<Content, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  updateContent: (id: string, content: Partial<Omit<Content, 'id' | 'type' | 'order' | 'createdAt' | 'updatedAt'>>) => void;
  deleteContent: (id: string) => void;
  reorderContent: (id: string, newOrder: number) => void;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  focusedContentId: string | null;
  setFocusedContentId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'winmix-contents';

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

const validateContent = (content: unknown): content is Content => {
  if (!content || typeof content !== 'object') return false;
  
  const baseContent = content as Partial<Content>;
  if (!baseContent.id || !baseContent.type || typeof baseContent.order !== 'number') {
    return false;
  }

  const validTypes: ContentType[] = ['text', 'title', 'table', 'button', 'card', 'grid'];
  return validTypes.includes(baseContent.type);
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedContents = localStorage.getItem(STORAGE_KEY);
      if (savedContents) {
        const parsedContents = JSON.parse(savedContents);
        if (Array.isArray(parsedContents) && parsedContents.every(validateContent)) {
          setContents(parsedContents);
        } else {
          console.error('Invalid content structure in localStorage');
          setContents([]);
        }
      }
    } catch (error) {
      console.error('Failed to load contents from localStorage:', error);
      setContents([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
    } catch (error) {
      console.error('Failed to save contents to localStorage:', error);
    }
  }, [contents]);

  const addContent = useCallback((contentData: Omit<Content, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newContent: Content = {
      ...contentData,
      id: uuidv4(),
      order: contents.length,
      createdAt: now,
      updatedAt: now,
    } as Content;

    setContents(prev => [...prev, newContent]);
  }, [contents.length]);

  const updateContent = useCallback((id: string, contentUpdate: Partial<Omit<Content, 'id' | 'type' | 'order' | 'createdAt' | 'updatedAt'>>) => {
    setContents(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...contentUpdate,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    }));
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContents(prev => {
      const filtered = prev.filter(item => item.id !== id);
      return filtered.map((item, index) => ({ ...item, order: index }));
    });
  }, []);

  const reorderContent = useCallback((id: string, newOrder: number) => {
    setContents(prev => {
      const items = [...prev];
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) return prev;
      
      const [movedItem] = items.splice(itemIndex, 1);
      const targetOrder = Math.max(0, Math.min(newOrder, items.length));
      items.splice(targetOrder, 0, movedItem);
      
      return items.map((item, index) => ({
        ...item,
        order: index,
        updatedAt: new Date().toISOString(),
      }));
    });
  }, []);

  const value = {
    contents: [...contents].sort((a, b) => a.order - b.order),
    addContent,
    updateContent,
    deleteContent,
    reorderContent,
    editMode,
    setEditMode,
    zoomLevel,
    setZoomLevel,
    focusedContentId,
    setFocusedContentId,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;