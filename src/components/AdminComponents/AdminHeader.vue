<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/Users';
import { useLoginStore } from '@/stores/Login';
import router from '@/router';

const userStore = useUserStore();
const loginStore = useLoginStore()

const identity = computed(() => userStore.user);

const logout = async () => {
    try {
        const response = await loginStore.logoutLgn();
        if (!response.success) throw response;

        userStore.setUser(null);
        userStore.setLogged(false);
        userStore.setAuthenticated(false);
        userStore.setToken(null);
        router.push("/");
    } catch (error) {

    }

}

</script>

<template>
    <header>
        <router-link to="/">
            <p class="pseudo-logo">Todo<span>APP</span></p>
        </router-link>
        <div class="info__wrapper">
            <button type="button" class="logout" @click="logout">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"></path>
                    <path d="M15 12h-12l3 -3"></path>
                    <path d="M6 15l-3 -3"></path>
                </svg>
            </button>
            <div v-if="identity">
                <p>{{ identity.name }} {{ identity.last_name }}</p>
                <p v-if="identity.role === 'admin'">Administrador</p>
            </div>

        </div>
    </header>
</template>

<style scoped lang="scss">
header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 1rem 3rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #ffffff;
    font-family: 'Inter', sans-serif;
}

.pseudo-logo {
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.pseudo-logo span {
    font-weight: 900;
    color: #6366f1;
}

.info__wrapper {
    display: flex;
    align-items: center;

    gap: 1rem;
}

.logout {
    background-color: transparent;
    border: none;
    display: grid;
    place-items: center;
    padding: 0.5rem;
    transition: background-color 0.2s ease;

    border-radius: 50%;
}

.logout:hover,
.logout:focus-visible {
    background-color: #f3f4f6;
}

.logout svg {
    stroke: #374151;
}

.info__wrapper p {
    margin: 0;
    font-size: 1rem;
    color: #374151;
    font-weight: 500;
}

.info__wrapper p:last-child {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 400;
}
</style>