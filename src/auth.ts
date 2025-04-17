import api from "@/api/api";

export const validateToken = async (): Promise<boolean> => {
    try {
        const response = await api.getCurrentUser();
        return !!(response.data && response.data.id);
    } catch (error) {
        return false;
    }
};

export const checkAuth = async (code: string): Promise<boolean> => {
    const headers = { 'Content-Type': 'application/json' };
    try {
        const response = await api.checkAuth(code, headers);
        return response.data?.success === true;
    } catch (error) {
        return false;
    }
};