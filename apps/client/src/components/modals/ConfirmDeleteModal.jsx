import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
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
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
            </div>

            <p className="text-slate-600 mb-6">{message}</p>

            <div className="flex justify-end gap-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;