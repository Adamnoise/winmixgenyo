import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';
import { Content } from '@/types/content';
import { TextDisplay } from './ContentDisplays/TextDisplay';
import { TitleDisplay } from './ContentDisplays/TitleDisplay';
import { TableDisplay } from './ContentDisplays/TableDisplay';
import { ButtonDisplay } from './ContentDisplays/ButtonDisplay';
import { CardDisplay } from './ContentDisplays/CardDisplay';
import { GridDisplay } from './ContentDisplays/GridDisplay';
import { Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CanvasControls } from '@/components/PreziCanvas/CanvasControls';

export const ContentDisplay: React.FC = () => {
  const {
    contents,
    deleteContent,
    reorderContent,
    editMode,
    zoomLevel,
    focusedContentId,
    setFocusedContentId,
    // feltételezve, hogy lesz egy updateContent prop az editáláshoz
    // updateContent
  } = useContent();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Handle canvas interaction
  useEffect(() => {
    if (!canvasRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Using wheel for zooming is handled through the zoomLevel state
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) { // Right click or middle click
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setCanvasOffset(prev => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Prevent context menu when right-clicking for panning
      e.preventDefault();
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isDragging, dragStart]);

  // Handle focused content
  useEffect(() => {
    if (focusedContentId && canvasRef.current) {
      // When focusing on a specific content, reset canvas offset
      setCanvasOffset({ x: 0, y: 0 });
    }
  }, [focusedContentId]);

  // *** JAVÍTÁS KEZDETE (additionalProps eltávolítása) ***
  const renderContent = (content: Content) => {
    const isFocused = focusedContentId === content.id;

    // Props, amiket át akarunk adni a gyerek komponenseknek
    const commonProps = {
      onClick: () => {
        if (!editMode) {
          setFocusedContentId(content.id);
        }
      },
      // Hozzáadunk egy className-t a fókusz jelzésére és az alap stílusokhoz
      className: `transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500 rounded-lg' : ''} ${editMode ? 'cursor-default' : 'cursor-pointer'}`
    };

    // A commonProps objektumot szétterítjük (...commonProps)
    switch (content.type) {
      case 'text':
        {
        // Feltételezzük, hogy a TextDisplay fogadja a className és onClick propokat
        return <TextDisplay content={content} {...commonProps} />;
        }
      case 'title':
        {
        return <TitleDisplay content={content} {...commonProps} />;
        }
      case 'table':
        {
        return <TableDisplay content={content} {...commonProps} />;
        }
      case 'button':
        {
        // Figyelem: A ButtonDisplay lehet, hogy nem közvetlenül a gyökérelemre teszi ezeket a propokat.
        return <ButtonDisplay content={content} {...commonProps} />;
        }
      case 'card':
        return <CardDisplay content={content} {...commonProps} />;
      case 'grid':
        return <GridDisplay content={content} {...commonProps} />;
      default:
        {
        // Biztosítsuk, hogy a default ág explicit null-t adjon vissza TypeScript számára
        const exhaustiveCheck: never = content;
        return null;
        }
    }
  };
  // *** JAVÍTÁS VÉGE (additionalProps eltávolítása) ***

  const handleMoveUp = (id: string, currentOrder: number) => {
    if (currentOrder > 0) {
      reorderContent(id, currentOrder - 1);
    }
  };

  const handleMoveDown = (id: string, currentOrder: number) => {
    if (currentOrder < contents.length - 1) {
      reorderContent(id, currentOrder + 1);
    }
  };

  // *** JAVÍTÁS KEZDETE (Edit gomb onClick) ***
  const handleEdit = (contentId: string) => {
    console.log("Edit button clicked for content ID:", contentId);
    // Itt kellene meghívni a szerkesztő modalt/nézetet,
    // valószínűleg az updateContent függvénnyel a contextből.
    // Például: openEditModal(contentId);
  };
  // *** JAVÍTÁS VÉGE (Edit gomb onClick) ***


  // Calculate the scale and transform styles based on zoom level and focused content
  const canvasStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`, //canvasStyle
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  // If focusing on a specific content
  if (focusedContentId) {
    const focusedContent = contents.find(c => c.id === focusedContentId);
    if (focusedContent) {
      // Center the focused content
      // A transformOrigin már center center, nem szükséges újra beállítani,
      // a fókuszálást a zoom/pan kezelheti, vagy egy specifikus translate-et kellene kalkulálni.
      // A jelenlegi logika a teljes vásznat mozgatja/zoomolja.
    }
  }

  // Handle opening the drawer for adding new content
  const handleAddContent = () => {
    // The drawer is triggered from the CanvasControls
    // Ez a függvény lehet, hogy nem is szükséges itt, ha a CanvasControls maga kezeli a drawer nyitását.
  };

  return (
    <>
      <div
        className="relative w-full h-[calc(100vh-200px)] overflow-hidden bg-gray-100 dark:bg-gray-900"
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        <div
          ref={canvasRef}
          className="absolute w-full h-full"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
            style={canvasStyle}
          >
            {/* A belső div paddingjét és max-width-jét lehet, hogy finomítani kell a zoom/pan viselkedéshez */}
            <div className="p-4 space-y-6 max-w-4xl mx-auto">
              {contents.map((content) => (
                <div key={content.id} className="relative group">
                  {editMode && (
                    <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 bg-background/80 rounded-md shadow-lg border">
                      {/* Áthelyeztem a gombokat a jobb oldalra, függőlegesen középre igazítva */}
                      <Button
                        size="icon"
                        variant="ghost" // Változtattam ghost-ra a jobb illeszkedésért
                        className="h-7 w-7" // Kisebb gombok
                        onClick={() => handleMoveUp(content.id, content.order)}
                        disabled={content.order === 0}
                        title="Move Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleMoveDown(content.id, content.order)}
                        disabled={content.order === contents.length - 1}
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                       {/* *** JAVÍTÁS (Edit gomb onClick hozzáadása) *** */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-blue-500 hover:text-blue-700" // Kék szín a szerkesztéshez
                        onClick={() => handleEdit(content.id)} // onClick hozzáadva
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:text-red-700" // Piros szín a törléshez
                        onClick={() => deleteContent(content.id)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {/* Az editMode keretet és a renderelt tartalmat egy div-be tettem, hogy a hover és a fókusz együtt működjön */}
                  <div className={`${editMode ? 'border border-dashed border-transparent rounded-lg p-1 transition-all group-hover:border-blue-500' : ''}`}>
                     {/* A renderContent által visszaadott elemre kerül a fókusz és a kattintás */}
                    {renderContent(content)}
                  </div>
                </div>
              ))}
              {contents.length === 0 && !editMode && ( // Csak akkor jelenjen meg, ha nincs tartalom ÉS nem vagyunk edit módban
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Még nincs tartalom.</p>
                   {/* Opcionálisan: Gomb az edit mód bekapcsolásához vagy tartalom hozzáadásához */}
                   {/* <Button onClick={() => setEditMode(true)}>Szerkesztés mód</Button> */}
                </div>
              )}
               {contents.length === 0 && editMode && ( // Üzenet edit módban, ha nincs tartalom
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Adj hozzá új tartalmat a vászonvezérlőkkel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CanvasControls onAddClick={handleAddContent} />
    </>
  );
};
