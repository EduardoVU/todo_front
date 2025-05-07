import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import api from '@/api/api'

export const useBenefactorStore = defineStore('benefactorStore', () => {
    const state = reactive({
        data: null as unknown,
        added: null as unknown,
    })

    const setData = (item: unknown) => {
        state.data = item
    }

    const setAdded = (item: unknown) => {
        state.added = item
    }

    const getAllInfoBnf = async (item: any) => {
        const headers = { 'Content-Type': 'application/json' };

        try {
            const response = await api.getAllInfo(item, headers);
            if (!response.data) throw response;
            setData(response.data);
            return response.data;

        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Error al obtener los datos',
                status: error?.status || 500,
            }
        }
    }

    const getInfoByIdBnf = async (item: any) => {
        const headers = { 'Content-Type': 'application/json' };
        try {
            const response = await api.getInfoById(item, headers);
            if (!response.data) throw response;
            setData(response.data);
            return response.data;

        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Error al obtener información específica',
                status: error?.status || 500,
            }
        }
    }

    const addItemBnf = async (item: any) => {
        const headers = { 'Content-Type': 'application/json' };

        try {
            const response = await api.addItem(item, headers);
            if (!response.data) throw response;
            return response.data;

        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Error al crear usuario',
                status: error?.status || 500,
            }
        }
    }

    const editItemBnf = async (item: any) => {
        const headers = { 'Content-Type': 'application/json' };

        try {
            const response = await api.editItem(item, headers);
            if (!response.data) throw response;
            return response.data;

        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Error al editar perfil',
                status: error?.status || 500,
            }
        }
    }

    const deleteItemBnf = async (item: any) => {
        const headers = { 'Content-Type': 'application/json' };

        try {
            const response = await api.deleteItem(item, headers);
            if (!response.data) throw response;
            return response.data;

        } catch (error: any) {
            return {
                success: false,
                message: error?.detail || 'Error al eliminar usuario',
                status: error?.status || 500,
            }
        }
    }

    return { ...toRefs(state), setData, setAdded, getAllInfoBnf, getInfoByIdBnf, addItemBnf, editItemBnf, deleteItemBnf }
})
