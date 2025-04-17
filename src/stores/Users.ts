import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const state = reactive({
    user: null as any,
    logged: false,
    authenticated: false,
    token: null as string | null,
  });

  const setUser = (user: any) => {
    state.user = user;
  };

  const setLogged = (value: boolean) => {
    state.logged = value;
  }

  const setAuthenticated = (value: boolean) => {
    state.authenticated = value;
  }

  const setToken = (value: string) => {
    state.token = value;
  }

  return { state, setUser, setLogged, setAuthenticated, setToken };
});
