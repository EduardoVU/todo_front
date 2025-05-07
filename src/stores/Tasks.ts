import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import api from '@/api/api'

export enum TaskStatusEnum {
  pendiente = "pendiente",
  completada = "completada",
  atrasada = "atrasada"
}

export interface Tasks {
  id?: number
  title: string
  due_date: string
  status: TaskStatusEnum;
  homework_id: number
}

export const useTaskStore = defineStore('taskStore', () => {
  const state = reactive({
    data: null as Tasks | Tasks[] | null,
    added: null as Tasks | null,
  });

  const setData = (item: Tasks | Tasks[]) => {
    state.data = item;
  };

  const setAdded = (item: Tasks | null) => {
    state.added = item;
  };

  const getAllInfoTsk = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.getAllInfo(item, headers);
      if (!response.data) throw response;
      setData(response.data as unknown as Tasks | Tasks[]);
      return response.data;

    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Error al obtener los datos',
        status: error?.status || 500,
      };
    }
  };

  const getInfoByIdTsk = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.getInfoById(item, headers);
      if (!response.data) throw response;
      setData(response.data as unknown as Tasks | Tasks[]);
      return response.data;

    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Error al obtener información específica',
        status: error?.status || 500,
      };
    }
  };

  const addItemTsk = async (item: any) => {
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

  const editItemTsk = async (item: any) => {
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

  const deleteItemTsk = async (item: any) => {
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
    getAllInfoTsk,
    getInfoByIdTsk,
    addItemTsk,
    editItemTsk,
    deleteItemTsk
  };
});
