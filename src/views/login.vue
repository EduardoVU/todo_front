<script setup lang="ts">
import { reactive } from 'vue'

import { useLoginStore } from '@/stores/Login'
import { useUserStore } from '@/stores/Users';

import statusMessage from '@/components/utils/StatusMessage.vue'
import { useRouter } from 'vue-router'

const loginStore = useLoginStore();
const userStore = useUserStore();

const router = useRouter()

const user = reactive({
    username: '',
    password: ''
})

const statusState = reactive({
    status: '',
    message: ''
})

const submitData = async () => {
    try {
        statusState.status = '';
        statusState.message = '';

        const response = await loginStore.loginLgn(user);
        if (!response || response.success === false) throw response;

        if (response && 'user' in response && response.success) {
            userStore.setUser(response.user);
        }

        userStore.setLogged(response.success)
        if ('access_token' in response) {
            userStore.setToken(response.access_token)
        }

        // router.push('/auth');
        router.push('/administrador');
    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'message' in error) ? statusState.message = (error as { message: string }).message : statusState.message = 'Ha ocurrido un error desconocido';
    }
};
</script>
<template>
    <main>
        <form @submit.prevent="submitData">
            <h1>Login</h1>

            <fieldset>
                <label for="user">Correo</label>
                <input type="email" id="user" name="user" placeholder="Usuario" v-model="user.username" />
            </fieldset>

            <fieldset>
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Contraseña" v-model="user.password" />
            </fieldset>

            <router-link to="registro">¿No tienes cuenta? Registrate aquí</router-link>

            <button type="submit">Iniciar Sesión</button>

            <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
                class="status-inside" />
        </form>
    </main>
</template>
<style scoped lang="scss">
input:-webkit-autofill {
  -webkit-text-fill-color: #000 !important;
}


input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-background-clip: text;
    -webkit-text-fill-color: #ffffff;
    transition: background-color 5000s ease-in-out 0s;
}

main {
    display: grid;
    place-items: center;
    min-height: 100vh;
    background-image: linear-gradient(to right, #f5f7fa, #c3cfe2);
    font-family: 'Inter', sans-serif;

    padding: 1rem;
}

h1 {
    text-align: center;
    color: #333;

    font-size: 2rem;
    margin-bottom: 1rem;
}

form {
    display: grid;
    background: #FFF;

    width: min(100%, 26rem);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 .625rem 1.5625rem rgba(0, 0, 0, 0.1);
    gap: 1rem;
}

fieldset {
    display: grid;
    padding: 0;
    border: none;

    gap: 0.5rem;
}

label {
    font-weight: 500;
    color: #444;
    font-size: 0.9rem;
}

input {
    width: 100%;
    transition: border-color 0.3s;
    outline: none;

    padding: 0.6rem 0.75rem;
    border-radius: 0.5rem;
    border: .0625rem solid #ccc;
    font-size: 1rem;

    &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 .1875rem rgba(99, 102, 241, 0.3);
    }
}

button {
    padding: 0.75rem 1rem;
    background-color: #6366f1;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: background-color 0.3s;
    margin-top: 1rem;

    &:hover {
        background-color: #4f46e5;
    }
}

a {
    font-size: 0.85rem;
    color: #6366f1;
    text-decoration: none;
    margin: 0.5rem auto 0;

    &:hover {
        text-decoration: underline;
    }
}
</style>