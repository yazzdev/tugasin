import React, { useState, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Edit3, Trash2, Calendar, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const Card = ({ card, index, onUpdate, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || '');
  const [editDueDate, setEditDueDate] = useState(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
  const [isOverdue, setIsOverdue] = useState(false);

  // Check if due date is overdue
  useEffect(() => {
    if (card.dueDate) {
      const due = new Date(card.dueDate);
      const now = new Date();
      setIsOverdue(due < now && !card.completed);
    }
  }, [card.dueDate, card.completed]);

  const handleSave = async () => {
    if (editTitle.trim()) {
      try {
        const payload = {
          title: editTitle.trim(),
          description: editDescription.trim(),
          dueDate: editDueDate || null,
          completed: card.completed
        };

        const updatedCard = await api.updateCard(card.id, payload);
        onUpdate(updatedCard);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }
  };

  const toggleCompleted = async () => {
    try {
      const updatedCard = await api.updateCard(card.id, { completed: !card.completed });
      onUpdate(updatedCard);
    } catch (error) {
      console.error('Error updating card status:', error);
    }
  };

  const deleteCard = async () => {
    try {
      await api.deleteCard(card.id);
      onDelete(card.id);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm border ${card.completed
              ? 'border-green-300'
              : isOverdue
                ? 'border-red-300'
                : 'border-gray-200'
            } p-3 mb-2 cursor-move transition-all ${snapshot.isDragging ? 'shadow-lg transform scale-105' : ''
            } hover:shadow-md`}
        >
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-sm font-medium text-slate-800 border border-gray-300 rounded px-2 py-1"
                placeholder="Card title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full text-xs text-slate-600 border border-gray-300 rounded px-2 py-1 resize-none"
                placeholder="Add a description..."
                rows="2"
              />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-skylight-primary text-white text-xs rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCompleted}
                    className={`p-0.5 rounded-full ${card.completed
                        ? 'text-green-500 bg-green-100'
                        : 'text-gray-300 hover:text-green-500'
                      }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <h4 className={`text-sm font-medium ${card.completed
                      ? 'line-through text-slate-500'
                      : 'text-slate-800'
                    }`}>
                    {card.title}
                  </h4>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-left"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCard();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-left text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {card.description && (
                <p className="text-xs text-slate-600 mt-1">
                  {card.description}
                </p>
              )}

              {card.dueDate && (
                <div className={`flex items-center gap-1 mt-2 text-xs ${isOverdue ? 'text-red-500' : 'text-slate-500'
                  }`}>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(card.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {isOverdue && <span className="ml-1">(Overdue)</span>}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;