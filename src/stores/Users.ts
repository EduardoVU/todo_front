import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

interface User {
  id?: number;
  name: string;
  last_name: string;
  role: 'admin' | 'cliente';
}

export const useUserStore = defineStore('userStore', () => {
  const state = reactive({
    user: null as User | null,
    logged: false,
    authenticated: false,
    token: null as string | null,
  });

  const setUser = (user: User | null) => {
    state.user = user;
  };

  const setLogged = (value: boolean) => {
    state.logged = value;
  }

  const setAuthenticated = (value: boolean) => {
    state.authenticated = value;
  }

  const setToken = (value: string | null) => {
    state.token = value;
  }

  return { ...toRefs(state), setUser, setLogged, setAuthenticated, setToken };
});
