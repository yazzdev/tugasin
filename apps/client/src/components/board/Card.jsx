import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

const Card = ({ card, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || '');

  const handleSave = async () => {
    if (editTitle.trim()) {
      try {
        await api.updateCard(card.id, {
          title: editTitle.trim(),
          description: editDescription.trim()
        });
        card.title = editTitle.trim();
        card.description = editDescription.trim();
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }
  };

  const deleteCard = async () => {
    try {
      await api.deleteCard(card.id);
      // Parent component will handle removal
      window.location.reload();
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
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2 cursor-move transition-all ${snapshot.isDragging ? 'shadow-lg transform scale-105' : ''
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
                <h4 className="text-sm font-medium text-slate-800 mb-1">
                  {card.title}
                </h4>
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
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;