<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLoginStore } from '@/stores/Login'
import { useUserStore } from '@/stores/Users'
import { useRouter } from 'vue-router'

import statusMessage from '@/components/utils/StatusMessage.vue'

const loginStore = useLoginStore();
const userStore = useUserStore();
const router = useRouter()


const code = ref('');

const statusState = reactive({
    status: '',
    message: ''
})

const submitData = async () => {
    try {
        const response = await loginStore.authLgn(code.value);
        if (!response || response.success === false) throw response;
        userStore.setAuthenticated(response.success)
        router.push('/administrador');
    } catch (error) {
        console.log('error', error);
    }
};
</script>
<template>
    <main>
        <form @submit.prevent="submitData">
            <h1>Autenticación</h1>

            <fieldset>
                <label for="auth">Código de autenticación</label>
                <input type="text" id="auth" name="auth" placeholder="Código de autenticación" v-model="code" />
            </fieldset>

            <button type="submit">Verificar</button>

            <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
            class="status-inside" />    
        </form>
    </main>
</template>
<style scoped lang="scss">
main {
    display: grid;
    place-items: center;
    min-height: 100vh;
    background-color: #EFEFEF;
}

h1 {
    text-align: center;
    margin: 1rem 0;
    font-size: 2rem;
}

form {
    display: grid;
    background: #FFF;

    width: min(100%, 25rem);
    padding: .9375rem;
    border-radius: .625rem;
    box-shadow: .0625rem .3125rem .75rem 0 rgba(0, 0, 0, 0.09);
    gap: .625rem;
}

fieldset {
    display: grid;
    padding: 0;
    border: 0;
    justify-items: start;

    gap: .625rem;
}

input {
    width: 100%;
    padding: .1875rem .625rem;
}

button {
    padding: .5rem 1rem;
    margin: 1rem auto 0;
}

.status-inside {
    width: fit-content;
    margin: 0 auto;
}
</style>