import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import BoardContext from '../contexts/BoardContext';
import Header from '../components/layout/Header';
import Column from '../components/board/Column';
import ShareModal from '../components/modals/ShareModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Button from '../components/ui/Button';
import api from '../services/api';
import { Plus, Share2, Trash2, Users } from 'lucide-react';

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

    // Simulate real-time user count (in real app, this would be WebSocket)
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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'COLUMN') {
      const newColumnOrder = Array.from(columns);
      const [movedColumn] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, movedColumn);

      setColumns(newColumnOrder);

      try {
        await Promise.all(
          newColumnOrder.map((column, index) =>
            api.updateColumnPosition(column.id, index)
          )
        );
      } catch (error) {
        console.error('Error updating column positions:', error);
        loadBoard();
      }
    } else {
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destinationColumn = columns.find(col => col.id === destination.droppableId);

      if (!sourceColumn || !destinationColumn) return;

      if (sourceColumn.id === destinationColumn.id) {
        const newCards = Array.from(sourceColumn.cards || []);
        const [movedCard] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, movedCard);

        const updatedColumns = columns.map(col =>
          col.id === sourceColumn.id
            ? { ...col, cards: newCards }
            : col
        );

        setColumns(updatedColumns);

        try {
          await Promise.all(
            newCards.map((card, index) =>
              api.updateCardPosition(card.id, index, card.columnId)
            )
          );
        } catch (error) {
          console.error('Error updating card positions:', error);
          loadBoard();
        }
      } else {
        const sourceCards = (sourceColumn.cards || []).filter((_, i) => i !== source.index);
        const movedCard = (sourceColumn.cards || [])[source.index];

        if (!movedCard) return;

        const newDestinationCards = Array.from(destinationColumn.cards || []);
        newDestinationCards.splice(destination.index, 0, { ...movedCard, columnId: destinationColumn.id });

        const updatedColumns = columns.map(col => {
          if (col.id === sourceColumn.id) {
            return { ...col, cards: sourceCards };
          }
          if (col.id === destinationColumn.id) {
            return { ...col, cards: newDestinationCards };
          }
          return col;
        });

        setColumns(updatedColumns);

        try {
          await api.moveCard(movedCard.id, destinationColumn.id, destination.index);
        } catch (error) {
          console.error('Error moving card:', error);
          loadBoard();
        }
      }
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

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" type="COLUMN" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]"
                >
                  {columns.map((column, index) => (
                    <Column
                      key={column.id}
                      column={column}
                      index={index}
                      boardId={boardId}
                      onDelete={deleteColumn}
                    />
                  ))}
                  {provided.placeholder}

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
              )}
            </Droppable>
          </DragDropContext>
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