import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Plus, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

const Column = ({ column, index }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleTitleChange = async (e) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle !== column.title) {
      try {
        await api.updateColumn(column.id, { title: newTitle.trim() });
        column.title = newTitle.trim();
      } catch (error) {
        console.error('Error updating column:', error);
      }
    }
    setIsEditingTitle(false);
  };

  const deleteColumn = async () => {
    try {
      await api.deleteColumn(column.id);
      // Remove column from UI (parent component will handle this)
      window.location.reload();
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const addCard = async () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      description: '',
      columnId: column.id,
      position: column.cards.length
    };

    // Update UI optimistically
    const updatedCards = [...column.cards, newCard];
    // Parent component will handle the actual update

    try {
      const response = await api.addCard(column.id, newCard.title, newCard.description, column.cards.length);
      // Update with actual ID from server
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white rounded-lg shadow-sm border border-gray-200 w-72 flex-shrink-0"
        >
          {/* Column Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {isEditingTitle ? (
                <form onSubmit={handleTitleChange} className="flex-1">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleTitleChange}
                    autoFocus
                    className="text-lg font-semibold p-1 border border-gray-300 rounded"
                  />
                </form>
              ) : (
                <h3
                  {...provided.dragHandleProps}
                  className="text-lg font-semibold text-slate-800 cursor-move hover:text-skylight-primary"
                  onDoubleClick={() => setIsEditingTitle(true)}
                >
                  {column.title}
                </h3>
              )}

              <div className="relative">
                <Button
                  onClick={() => setShowMenu(!showMenu)}
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-gray-100"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>

                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-left"
                    >
                      <Edit3 className="w-4 h-4" />
                      Rename
                    </button>
                    <button
                      onClick={deleteColumn}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-left text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500">{column.cards.length} cards</p>
          </div>

          {/* Cards */}
          <Droppable droppableId={column.id} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-2 min-h-32 ${snapshot.isDraggingOver ? 'bg-skylight-hover' : ''}`}
              >
                {column.cards.map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={cardIndex}
                  />
                ))}
                {provided.placeholder}

                <Button
                  onClick={addCard}
                  variant="ghost"
                  className="w-full mt-2 text-slate-500 hover:text-skylight-primary hover:bg-skylight-primary/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;