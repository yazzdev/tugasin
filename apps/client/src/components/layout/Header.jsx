import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import api from '../../services/api';

const Header = ({ board }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState(board?.name || 'Untitled Board');
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSave = async () => {
    try {
      await api.updateBoard(board.id, { name: boardName });
      setIsEditing(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-skylight-primary p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Tugasin</h1>
          </Link>

          {board && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg font-semibold text-slate-800 cursor-pointer hover:text-skylight-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  {boardName}
                </h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Board Name Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Update Board Name</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setBoardName(board?.name || 'Untitled Board');
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Board Name
                </label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                  placeholder="Enter board name"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setBoardName(board?.name || 'Untitled Board');
                }}
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
    </header>
  );
};

export default Header;