// /src/context/ContentContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ContentType } from '@/types/content'; // Feltételezzük, hogy a típusok itt vannak helyesen definiálva

// Define the shape of the context data
interface ContentContextType {
  contentList: ContentType[];
  addContent: (content: Omit<ContentType, 'id'>) => void;
  updateContent: (updatedContent: ContentType) => void;
  deleteContent: (id: string) => void;
}

// Create the context with a default undefined value
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Create the provider component
interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [contentList, setContentList] = useState<ContentType[]>([]);

  // Function to add new content
  const addContent = useCallback((content: Omit<ContentType, 'id'>) => {
    const newContent: ContentType = {
      ...content,
      // Consider using crypto.randomUUID() for more robust unique IDs
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Slightly more unique than just Date.now()
    };
    setContentList(prevList => [...prevList, newContent]);
  }, []);

  // Function to update existing content
  const updateContent = useCallback((updatedContent: ContentType) => {
    setContentList(prevList =>
      prevList.map(content =>
        content.id === updatedContent.id ? updatedContent : content
      )
    );
  }, []);

  // Function to delete content by ID
  const deleteContent = useCallback((id: string) => {
    setContentList(prevList => prevList.filter(content => content.id !== id));
  }, []);

  // The value provided by the context
  const value = {
    contentList,
    addContent,
    updateContent,
    deleteContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use the ContentContext
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
