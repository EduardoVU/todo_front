import { defineStore } from 'pinia'
import api from '@/api/api'

export const useLoginStore = defineStore('loginStore', () => {

  const loginLgn = async (item: any) => {
    const body = new URLSearchParams();
    for (const key in item) {
      body.append(key, item[key]);
    }
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    try {
      const response = await api.login(body, headers);
      if (!response.data) throw response;

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error al hacer login',
        status: error.status || 500,
      };
    }
  }

  const authLgn = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.checkAuth(item, headers);
      if (!response.data) throw response;
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.detail || 'Error al hacer login',
        status: error.status || 500,
      };
    }
  }

  const addItemLgn = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.addItem(item, headers);
      if (!response.data) throw response;
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.detail || 'Error al crear usuario',
        status: error.status || 500,
      };
    }
  }

  const logoutLgn = async () => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.logout(headers);
      if (!response.data) throw response;
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.detail || 'Error al cerrar sesión',
        status: error.status || 500,
      };
    }
  }
  return { loginLgn, authLgn, addItemLgn, logoutLgn }
})
