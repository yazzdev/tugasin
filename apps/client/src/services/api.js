import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  // Board operations
  async getBoard(boardId) {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  async createBoard(boardId) {
    const response = await api.post('/boards', { id: boardId });
    return response.data;
  },

  async deleteBoard(boardId) {
    await api.delete(`/boards/${boardId}`);
  },

  // Column operations
  async addColumn(boardId, title, position) {
    const response = await api.post('/columns', { boardId, title, position });
    return response.data;
  },

  async updateColumn(columnId, data) {
    const response = await api.put(`/columns/${columnId}`, data);
    return response.data;
  },

  async deleteColumn(columnId) {
    await api.delete(`/columns/${columnId}`);
  },

  // Card operations
  async addCard(columnId, title, description, position, dueDate = null, completed = false) {
    const response = await api.post('/cards', {
      columnId,
      title,
      description,
      position,
      dueDate,
      completed
    });
    return response.data;
  },

  async updateCard(cardId, data) {
    const response = await api.put(`/cards/${cardId}`, data);
    return response.data;
  },

  async deleteCard(cardId) {
    await api.delete(`/cards/${cardId}`);
  },

  // Move card between columns
  async moveCard(cardId, newColumnId, newPosition) {
    const response = await api.patch(`/cards/${cardId}/move`, {
      newColumnId,
      newPosition
    });
    return response.data;
  },
};