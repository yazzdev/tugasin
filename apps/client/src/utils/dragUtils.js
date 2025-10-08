// Simple drag-and-drop state management
let dragState = {
  isDragging: false,
  draggedItem: null,
  source: null,
  type: null // 'CARD' or 'COLUMN'
};

export const startDrag = (item, source, type) => {
  dragState = {
    isDragging: true,
    draggedItem: item,
    source,
    type
  };
};

export const getDragState = () => dragState;

export const clearDragState = () => {
  dragState = {
    isDragging: false,
    draggedItem: null,
    source: null,
    type: null
  };
};