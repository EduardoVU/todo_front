import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import api from '@/api/api'

export interface Homework {
  id: number;
  user_id: number;
  title: string | null;
  description: string | null;
  due_date: string;
  status: string;
}

export const useHomeworksStore = defineStore('homeworksStore', () => {
  const state = reactive({
    data: null as Homework | Homework[] | null,
    added: null as Homework | null,
  });

  const setData = (item: Homework | Homework[] | null) => {
    state.data = item;
  };

  const setAdded = (item: Homework | null) => {
    state.added = item;
  };

  const getAllInfoHmw = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.getAllInfo(item, headers);
      if (!response.data) throw response;
      setData(response.data as unknown as Homework | Homework[]);
      return response.data;

    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Error al obtener los datos',
        status: error?.status || 500,
      };
    }
  };

  const getInfoByIdHmw = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.getInfoById(item, headers);
      if (!response.data) throw response;
      setData(response.data as unknown as Homework | Homework[]);
      return response.data;

    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Error al obtener información específica',
        status: error?.status || 500,
      };
    }
  };

  const addItemHmw = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.addItem(item, headers);
      if (!response.data) throw response;
      return response.data;

    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Error al crear tarea',
        status: error?.status || 500,
      };
    }
  };

  const editItemHmw = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.editItem(item, headers);
      if (!response.data) throw response;
      return response.data;

    } catch (error: any) {
      console.error("Error al editar tarea:", error);
      return {
        success: false,
        message: error?.message || 'Error al editar tarea',
        status: error?.status || 500,
      };
    }
  };

  const deleteItemHmw = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.deleteItem(item, headers);
      if (!response.data) throw response;
      return response.data;

    } catch (error: any) {
      return {
        success: false,
        message: error?.detail || 'Error al eliminar tarea',
        status: error?.status || 500,
      };
    }
  };

  return {
    ...toRefs(state),
    setData,
    setAdded,
    getAllInfoHmw,
    getInfoByIdHmw,
    addItemHmw,
    editItemHmw,
    deleteItemHmw
  };
});
