import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to update last active time
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
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

  async updateColumnPosition(columnId, position) {
    await api.patch(`/columns/${columnId}/position`, { position });
  },

  async deleteColumn(columnId) {
    await api.delete(`/columns/${columnId}`);
  },

  // Card operations
  async addCard(columnId, title, description, position) {
    const response = await api.post('/cards', { columnId, title, description, position });
    return response.data;
  },

  async updateCard(cardId, data) {
    const response = await api.put(`/cards/${cardId}`, data);
    return response.data;
  },

  async updateCardPosition(cardId, position, columnId) {
    await api.patch(`/cards/${cardId}/position`, { position, columnId });
  },

  async moveCard(cardId, newColumnId, newPosition) {
    await api.patch(`/cards/${cardId}/move`, {
      newColumnId,
      newPosition
    });
  },

  async deleteCard(cardId) {
    await api.delete(`/cards/${cardId}`);
  },
};