import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import BoardContext from '../contexts/BoardContext';
import Header from '../components/layout/Header';
import Column from '../components/board/Column';
import ShareModal from '../components/modals/ShareModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Button from '../components/ui/Button';
import api from '../services/api';
import { Plus, Share2, Trash2, Users } from 'lucide-react';
import { getDragState, clearDragState } from '../utils/dragUtils';

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);

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
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const addColumn = async () => {
    const newColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      boardId,
      position: columns.length,
      cards: []
    };

    setColumns(prev => [...prev, newColumn]);

    try {
      const response = await api.addColumn(boardId, newColumn.title, columns.length);
      setColumns(prev =>
        prev.map(col =>
          col.id === newColumn.id
            ? { ...response.column, cards: Array.isArray(response.column.cards) ? response.column.cards : [] }
            : col
        )
      );
    } catch (error) {
      console.error('Error adding column:', error);
      setColumns(prev => prev.filter(col => col.id !== newColumn.id));
    }
  };

  const deleteBoard = async () => {
    try {
      await api.deleteBoard(boardId);
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const deleteColumn = async (columnId) => {
    try {
      await api.deleteColumn(columnId);
      setColumns(prev => prev.filter(col => col.id !== columnId));
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const handleCardDrop = (targetColumnId) => {
    const dragState = getDragState();
    if (dragState.isDragging && dragState.type === 'CARD') {
      // Find source column
      const sourceColumn = columns.find(col => col.id === dragState.source.columnId);
      if (!sourceColumn) {
        clearDragState();
        return;
      }

      // Find dragged card
      const draggedCard = sourceColumn.cards.find(card => card.id === dragState.draggedItem.id);
      if (!draggedCard) {
        clearDragState();
        return;
      }

      // Update UI
      const newColumns = columns.map(col => {
        if (col.id === sourceColumn.id) {
          // Remove from source
          return {
            ...col,
            cards: col.cards.filter(card => card.id !== draggedCard.id)
          };
        }
        if (col.id === targetColumnId) {
          // Add to target
          return {
            ...col,
            cards: [...col.cards, { ...draggedCard, columnId: targetColumnId }]
          };
        }
        return col;
      });

      setColumns(newColumns);
      clearDragState();

      // Update API
      api.moveCard(draggedCard.id, targetColumnId, newColumns.find(c => c.id === targetColumnId).cards.length - 1);
    }
  };

  const updateColumn = (columnId, updates) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    ));
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
                onCardDrop={handleCardDrop}
                onColumnUpdate={updateColumn}
              />
            ))}

            <div className="flex-shrink-0">
              <Button
                onClick={addColumn}
                variant="outline"
                className="h-12 flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-skylight-primary hover:bg-skylight-primary/5"
              >
                <Plus className="w-5 h-5" />
                Add Column
              </Button>
            </div>
          </div>
        </div>

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
      </div>
    </BoardContext.Provider>
  );
};

export default BoardPage;