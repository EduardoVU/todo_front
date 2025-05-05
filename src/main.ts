
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { url } from '@/global/index'
import { useUserStore } from '@/stores/Users'
import axios from 'axios'
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore();

axios.defaults.baseURL = url;
// Interceptor para agregar el token en cada solicitud automáticamente
axios.interceptors.request.use(
    (config) => {
        const token = userStore.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

app.mount('#app')
