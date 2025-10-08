import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ColorPicker from '../ui/ColorPicker';

const CardModal = ({ isOpen, onClose, onSubmit, initialData = {}, isEdit = false, columnColor = '#3b82f6' }) => {
  const [title, setTitle] = useState(initialData.title || 'New Task');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.dueDate || new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState(initialData.color || columnColor);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate, color });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {isEdit ? 'Edit Task' : 'Add Task'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Task Name
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary focus:border-transparent"
                  rows="3"
                  placeholder="Add a description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Color
                </label>
                <ColorPicker value={color} onChange={setColor} />
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-skylight-primary hover:bg-blue-600">
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardModal;