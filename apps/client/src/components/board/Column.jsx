import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Plus, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

const Column = ({ column, index, boardId, onDelete }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [cards, setCards] = useState(column.cards || []);

  const handleTitleChange = async (e) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle !== column.title) {
      try {
        await api.updateColumn(column.id, { title: newTitle.trim() });
      } catch (error) {
        console.error('Error updating column:', error);
      }
    }
    setIsEditingTitle(false);
  };

  const deleteColumn = async () => {
    try {
      await api.deleteColumn(column.id);
      onDelete(column.id);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const addCard = async () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Task',
      description: '',
      columnId: column.id,
      position: cards.length,
      dueDate: null,
      completed: false
    };

    // Optimistically add to UI
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);

    try {
      const response = await api.addCard(
        column.id,
        newCard.title,
        newCard.description,
        cards.length,
        newCard.dueDate,
        newCard.completed
      );
      // Replace with actual card from API
      const finalCards = updatedCards.map(card =>
        card.id === newCard.id ? response.card : card
      );
      setCards(finalCards);
    } catch (error) {
      console.error('Error adding card:', error);
      // Revert optimistic update
      setCards(cards);
    }
  };

  // Handle card updates from child components
  const updateCardInColumn = (updatedCard) => {
    setCards(prev => prev.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const deleteCardFromColumn = (cardId) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  // Calculate completed cards
  const completedCount = cards.filter(card => card.completed).length;
  const totalCount = cards.length;

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white rounded-lg shadow-sm border border-gray-200 w-72 flex-shrink-0 flex flex-col"
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

            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">
                {totalCount} {totalCount === 1 ? 'card' : 'cards'}
              </p>
              {completedCount > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {completedCount} completed
                </span>
              )}
            </div>
          </div>

          {/* Cards */}
          <Droppable droppableId={column.id} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-2 min-h-32 flex-1 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-skylight-hover' : ''
                  }`}
              >
                {cards.map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    onUpdate={updateCardInColumn}
                    onDelete={deleteCardFromColumn}
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