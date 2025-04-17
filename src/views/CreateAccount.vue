<script setup lang="ts">
import { reactive } from 'vue'

import { useLoginStore } from '@/stores/Login'

import statusMessage from '@/components/utils/StatusMessage.vue'
import { useRouter } from 'vue-router'

const loginStore = useLoginStore();

const router = useRouter()

const user = reactive({
    name: "",
    last_name: "",
    email: "",
    password: ""
})

const statusState = reactive({
    status: '',
    message: ''
})

const submitData = async () => {
    try {
        console.log("user")
        console.log(user)
        const response = await loginStore.addItemLgn({
            option: 'users',
            item: user
        });

        console.log("response")
        console.log(response)

        if (!response || response.success === false) throw response;

        router.push('/');
    } catch (error) {
        console.log('error', error);
    }
};
</script>
<template>
    <main>
        <form @submit.prevent="submitData">
            <h1>Registro</h1>

            <fieldset>
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Nombre" v-model="user.name" />
            </fieldset>

            <fieldset>
                <label for="lastName">Apellido</label>
                <input type="text" id="lastNname" name="lastNname" placeholder="Apellido" v-model="user.last_name" />
            </fieldset>

            <fieldset>
                <label for="user">Correo</label>
                <input type="email" id="user" name="user" placeholder="Correo" v-model="user.email" />
            </fieldset>

            <fieldset>
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Contraseña" v-model="user.password" />
            </fieldset>

            <button type="submit">Registrarse</button>

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