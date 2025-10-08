import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Edit3, Trash2, Calendar, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import Toast from '../ui/Toast';

const Card = ({
  card,
  onUpdate,
  onDelete,
  columnId,
  allColumns,
  onMoveLeft,
  onMoveRight
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: card.title,
    description: card.description || '',
    dueDate: card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '',
    completed: card.completed
  });

  useEffect(() => {
    if (card.dueDate) {
      const due = new Date(card.dueDate);
      const now = new Date();
      setIsOverdue(due < now && !card.completed);
    }
  }, [card.dueDate, card.completed]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        completed: formData.completed
      };

      const updatedCard = await api.updateCard(card.id, payload);
      onUpdate(updatedCard);
      setShowEditModal(false);
      showToast('Task updated successfully', 'success');
    } catch (error) {
      console.error('Error updating card:', error);
      showToast('Failed to update task', 'error');
    }
  };

  const toggleCompleted = async () => {
    try {
      const updatedCard = await api.updateCard(card.id, { completed: !card.completed });
      onUpdate(updatedCard);
      showToast(`Task marked as ${updatedCard.completed ? 'completed' : 'pending'}`, 'success');
    } catch (error) {
      console.error('Error updating card status:', error);
      showToast('Failed to update task status', 'error');
    }
  };

  const deleteCard = async () => {
    try {
      await api.deleteCard(card.id);
      onDelete(card.id);
      setShowDeleteModal(false);
      showToast('Task deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting card:', error);
      showToast('Failed to delete task', 'error');
    }
  };

  const moveLeft = () => {
    onMoveLeft(card.id, columnId);
  };

  const moveRight = () => {
    onMoveRight(card.id, columnId);
  };

  // Find current column index for move buttons
  const currentColumnIndex = allColumns.findIndex(col => col.id === columnId);
  const canMoveLeft = currentColumnIndex > 0;
  const canMoveRight = currentColumnIndex < allColumns.length - 1;

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${card.completed
        ? 'border-green-300'
        : isOverdue
          ? 'border-red-300'
          : 'border-gray-200'
      } p-3 mb-2 transition-all hover:shadow-md relative group`}>
      {/* Move Buttons */}
      {canMoveLeft && (
        <button
          onClick={moveLeft}
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-orange-600"
          title="Move Left"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
      )}

      {canMoveRight && (
        <button
          onClick={moveRight}
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-green-600"
          title="Move Right"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      )}

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
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  setShowDetails(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-left"
              >
                <Edit3 className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-left"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
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

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Task Details</h3>
              <button
                onClick={() => setShowDetails(false)}
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
                <p className="text-sm text-slate-800 bg-gray-50 p-2 rounded">
                  {card.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <p className="text-sm text-slate-800 bg-gray-50 p-2 rounded min-h-[40px]">
                  {card.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Due Date
                  </label>
                  <p className="text-sm text-slate-800 bg-gray-50 p-2 rounded">
                    {card.dueDate
                      ? new Date(card.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      : 'No due date'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <p className={`text-sm p-2 rounded ${card.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {card.completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Column
                </label>
                <p className="text-sm text-slate-800 bg-gray-50 p-2 rounded">
                  {allColumns.find(col => col.id === columnId)?.title || 'Unknown Column'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Edit Task</h3>
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
                  Task Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
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
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-skylight-primary rounded focus:ring-skylight-primary"
                />
                <label className="ml-2 text-sm text-slate-700">
                  Mark as completed
                </label>
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
                onClick={handleSave}
                className="px-4 py-2 bg-skylight-primary text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteCard}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
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

export default Card;