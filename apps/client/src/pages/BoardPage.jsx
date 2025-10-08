import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import BoardContext from '../contexts/BoardContext';
import Header from '../components/layout/Header';
import Column from '../components/board/Column';
import ShareModal from '../components/modals/ShareModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Button from '../components/ui/Button';
import api from '../services/api';
import { Plus, Share2, Trash2, Users, X } from 'lucide-react';
import Toast from '../components/ui/Toast';

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [newColumnName, setNewColumnName] = useState('New Column');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getBoard(boardId);
      setBoard(response.board);
      const safeColumns = response.columns.map(col => ({
        ...col,
        cards: Array.isArray(col.cards) ? col.cards : []
      }));
      setColumns(safeColumns);
      setActiveUsers(response.activeUsers || 0);
    } catch (error) {
      console.error('Error loading board:', error);
      await createBoard();
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadBoard();

    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [loadBoard]);

  const createBoard = async () => {
    try {
      const response = await api.createBoard(boardId);
      setBoard(response.board);
      const safeColumns = response.columns.map(col => ({
        ...col,
        cards: Array.isArray(col.cards) ? col.cards : []
      }));
      setColumns(safeColumns);
      setActiveUsers(1);
      showToast('Board created successfully', 'success');
    } catch (error) {
      console.error('Error creating board:', error);
      showToast('Failed to create board', 'error');
    }
  };

  const handleAddColumn = async () => {
    try {
      const newColumn = {
        id: `col-${Date.now()}`,
        title: newColumnName,
        boardId,
        position: columns.length,
        cards: []
      };

      const updatedColumns = [...columns, newColumn];
      setColumns(updatedColumns);

      const response = await api.addColumn(boardId, newColumn.title, columns.length);
      setColumns(prev =>
        prev.map(col =>
          col.id === newColumn.id
            ? { ...response.column, cards: Array.isArray(response.column.cards) ? response.column.cards : [] }
            : col
        )
      );
      setShowAddColumnModal(false);
      setNewColumnName('New Column');
      showToast('Column added successfully', 'success');
    } catch (error) {
      console.error('Error adding column:', error);
      setColumns(columns);
      showToast('Failed to add column', 'error');
    }
  };

  const deleteBoard = async () => {
    try {
      await api.deleteBoard(boardId);
      window.location.href = '/';
      showToast('Board deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting board:', error);
      showToast('Failed to delete board', 'error');
    }
  };

  const deleteColumn = async (columnId) => {
    try {
      await api.deleteColumn(columnId);
      setColumns(prev => prev.filter(col => col.id !== columnId));
      showToast('Column deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting column:', error);
      showToast('Failed to delete column', 'error');
    }
  };

  const updateColumn = (columnId, updates) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const moveCard = async (cardId, sourceColumnId, targetColumnId) => {
    try {
      // Update position to 0 (append to target column)
      const updatedCard = await api.moveCard(cardId, targetColumnId, 0);

      // Update local state
      setColumns(prev => prev.map(col => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
          };
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            cards: [updatedCard, ...col.cards]
          };
        }
        return col;
      }));

      showToast('Task moved successfully', 'success');
    } catch (error) {
      console.error('Error moving card:', error);
      showToast('Failed to move task', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skylight-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <BoardContext.Provider value={{ board, columns, setColumns, boardId }}>
      <div className="board-container">
        <Header board={board} />

        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {board?.name || 'Untitled Board'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>{activeUsers} {activeUsers === 1 ? 'user' : 'users'} online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowShareModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Board
              </Button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                boardId={boardId}
                onDelete={deleteColumn}
                onColumnUpdate={updateColumn}
                allColumns={columns}
                onMoveCard={moveCard}
              />
            ))}

            <div className="flex-shrink-0">
              <Button
                onClick={() => setShowAddColumnModal(true)}
                variant="outline"
                className="h-12 flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-skylight-primary hover:bg-skylight-primary/5"
              >
                <Plus className="w-5 h-5" />
                Add Column
              </Button>
            </div>
          </div>
        </div>

        {/* Add Column Modal */}
        {showAddColumnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Add New Column</h3>
                <button
                  onClick={() => setShowAddColumnModal(false)}
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
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary"
                    placeholder="Enter column name"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddColumnModal(false)}
                  className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddColumn}
                  className="px-4 py-2 bg-skylight-primary text-white rounded-lg hover:bg-blue-600"
                >
                  Add Column
                </button>
              </div>
            </div>
          </div>
        )}

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          boardId={boardId}
        />

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteBoard}
          title="Delete Board"
          message="Are you sure you want to delete this board? This action cannot be undone."
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
    </BoardContext.Provider>
  );
};

export default BoardPage;