import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Link } from 'lucide-react';
import Button from '../ui/Button';

const ShareModal = ({ isOpen, onClose, boardId }) => {
  const [copied, setCopied] = useState(false);
  const boardUrl = `${window.location.origin}/board/${boardId}`;

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(boardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-skylight-primary/10 p-2 rounded-lg">
                <Link className="w-6 h-6 text-skylight-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Share Board</h2>
            </div>

            <p className="text-slate-600 mb-4">
              Share this link with your team to collaborate on this board.
            </p>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={boardUrl}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Anyone with this link can view and edit this board.
            </p>

            <div className="flex justify-end gap-2">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;