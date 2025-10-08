import React, { useState } from 'react';
import Card from './Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Plus, MoreHorizontal, Edit3, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import Toast from '../ui/Toast';

const Column = ({
  column,
  boardId,
  onDelete,
  onColumnUpdate,
  allColumns,
  onMoveCard
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cards, setCards] = useState(column.cards || []);
  const [toast, setToast] = useState(null);

  const [columnTitle, setColumnTitle] = useState(column.title);
  const [newCardData, setNewCardData] = useState({
    title: 'New Task',
    description: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddCard = async () => {
    try {
      const newCard = {
        id: `card-${Date.now()}`,
        title: newCardData.title,
        description: newCardData.description,
        columnId: column.id,
        position: cards.length,
        dueDate: newCardData.dueDate,
        completed: false
      };

      const updatedCards = [...cards, newCard];
      setCards(updatedCards);

      const response = await api.addCard(
        column.id,
        newCardData.title,
        newCardData.description,
        cards.length,
        newCardData.dueDate,
        false
      );

      const finalCards = updatedCards.map(card =>
        card.id === newCard.id ? response.card : card
      );
      setCards(finalCards);
      setShowAddCardModal(false);
      setNewCardData({
        title: 'New Task',
        description: '',
        dueDate: new Date().toISOString().split('T')[0]
      });
      showToast('Task added successfully', 'success');
    } catch (error) {
      console.error('Error adding card:', error);
      setCards(column.cards || []);
      showToast('Failed to add task', 'error');
    }
  };

  const handleUpdateColumn = async () => {
    try {
      await api.updateColumn(column.id, { title: columnTitle });
      onColumnUpdate(column.id, { title: columnTitle });
      setShowEditModal(false);
      showToast('Column updated successfully', 'success');
    } catch (error) {
      console.error('Error updating column:', error);
      showToast('Failed to update column', 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteColumn(column.id);
      onDelete(column.id);
      setShowDeleteModal(false);
      showToast('Column deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting column:', error);
      showToast('Failed to delete column', 'error');
    }
  };

  const updateCardInColumn = (updatedCard) => {
    setCards(prev => prev.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const deleteCardFromColumn = (cardId) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const moveCardToPreviousColumn = async (cardId) => {
    const currentIndex = allColumns.findIndex(col => col.id === column.id);
    if (currentIndex > 0) {
      const previousColumn = allColumns[currentIndex - 1];
      await onMoveCard(cardId, column.id, previousColumn.id);
    }
  };

  const moveCardToNextColumn = async (cardId) => {
    const currentIndex = allColumns.findIndex(col => col.id === column.id);
    if (currentIndex < allColumns.length - 1) {
      const nextColumn = allColumns[currentIndex + 1];
      await onMoveCard(cardId, column.id, nextColumn.id);
    }
  };

  const completedCount = cards.filter(card => card.completed).length;
  const totalCount = cards.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-72 flex-shrink-0 flex flex-col min-h-[400px] relative">
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-lg font-semibold text-slate-800 cursor-pointer hover:text-skylight-primary truncate"
            onClick={() => setShowEditModal(true)}
          >
            {column.title}
          </h3>

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
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-left"
                >
                  <Edit3 className="w-4 h-4" />
                  Rename
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
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

      {/* Cards with Fixed Height and Scroll */}
      <div className="p-2 flex-1 overflow-y-auto">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={updateCardInColumn}
            onDelete={deleteCardFromColumn}
            columnId={column.id}
            allColumns={allColumns}
            onMoveLeft={moveCardToPreviousColumn}
            onMoveRight={moveCardToNextColumn}
          />
        ))}

        <Button
          onClick={() => setShowAddCardModal(true)}
          variant="ghost"
          className="w-full mt-2 text-slate-500 hover:text-skylight-primary hover:bg-skylight-primary/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>

      {/* Edit Column Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Rename Column</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Column Name
                </label>
                <input
                  type="text"
                  value={columnTitle}
                  onChange={(e) => setColumnTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                  placeholder="Enter column name"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateColumn}
                className="px-4 py-2 bg-skylight-primary text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add New Task</h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newCardData.title}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                  placeholder="Enter task name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCardData.description}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary resize-none"
                  placeholder="Add description (optional)"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newCardData.dueDate}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-skylight-primary text-white rounded-lg hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Column"
        message="Are you sure you want to delete this column? All cards in this column will be permanently deleted."
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Column;