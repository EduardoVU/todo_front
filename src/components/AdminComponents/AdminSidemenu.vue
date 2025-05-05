<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/Users';
import { useHistoryStore } from '@/stores/History';
import { useBenefactorStore } from '@/stores/Benefactor';

const userStore = useUserStore();
const identity = computed(() => userStore.user);

const historyStore = useHistoryStore();

const setHistory = (value: string) => {
    historyStore.setHistoryOption(value);
}

const benefactorStore = useBenefactorStore();
const setBenefactorAdded = (id?: number) => {
    benefactorStore.setAdded(id);
}

const expanded = ref(false);
const animating = ref(false);
let timeoutId: ReturnType<typeof setTimeout>;

watch(expanded, () => {
    animating.value = true;
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        animating.value = false;
    }, 300);
});


</script>
<template>
    <aside :class="{ 'extended': expanded, 'animating': animating }">
        <div>
            <button @click="expanded = !expanded">
                <svg class="to-turn" :class="{ 'turned': expanded }" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path
                        d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-9v14h9a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007zm-4.387 4.21l.094 .083l2 2a1 1 0 0 1 .083 1.32l-.083 .094l-2 2a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.292 -1.293l-1.292 -1.293a1 1 0 0 1 -.083 -1.32l.083 -.094a1 1 0 0 1 1.32 -.083z">
                    </path>
                </svg>

                <div>
                    <p>Expandir</p>
                </div>
            </button>

            <div class="info-hover">
                <p>Expandir</p>
            </div>
        </div>

        <div>
            <button @click="setHistory('Default')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24"
                    stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
                    <path d="M6 9l6 0"></path>
                    <path d="M4 5l4 0"></path>
                    <path d="M6 5v11a1 1 0 0 0 1 1h5"></path>
                    <path d="M12 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z"></path>
                    <path d="M12 15m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z"></path>
                </svg>

                <div>
                    <p>Tareas</p>
                </div>
            </button>

            <div class="info-hover">
                <p>Tareas</p>
            </div>
        </div>

        <div>
            <button @click="setHistory('mi perfil'), setBenefactorAdded(identity?.id)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5"></path>
                    <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z"></path>
                </svg>

                <div>
                    <p>Mi perfil</p>
                </div>
            </button>

            <div class="info-hover">
                <p>Mi perfil</p>
            </div>
        </div>

        <div v-if="identity && identity.role === 'admin'">
            <button @click="setHistory('usuarios')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"></path>
                    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                    <path d="M17 10h2a2 2 0 0 1 2 2v1"></path>
                    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                    <path d="M3 13v-1a2 2 0 0 1 2 -2h2"></path>
                </svg>

                <div>
                    <p>Usuarios</p>
                </div>
            </button>

            <div class="info-hover">
                <p>Usuarios</p>
            </div>
        </div>
    </aside>
</template>
<style scoped lang="scss">
aside {
    display: grid;
    background-color: #F9FAFB;
    grid-auto-rows: max-content;
    padding: 1.25rem .625rem;
    font-family: 'Inter', sans-serif;
}

aside>div {
    position: relative;
    margin-bottom: .75rem;
}

button {
    display: grid;
    transition: all 0.3s ease;
    text-align: start;
    align-items: center;
    interpolate-size: allow-keywords;
    width: fit-content;
    border: none;
    background-color: transparent;

    grid-template-columns: 1.5rem 0fr;
    gap: .75rem;

}

.extended button {
    grid-template-columns: 1.5rem 1fr;
    width: 9.375rem;
    background-color: #e5e7eb;
}

button:hover,
button:focus-visible {
    background-color: #e0e7ff;
}

button:hover+.info-hover,
button:focus-visible+.info-hover {
    visibility: visible;
    opacity: 1;
}

.info-hover {
    position: absolute;
    z-index: 2;
    margin: auto;
    width: fit-content;
    text-wrap: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    background-color: #1f2937;
    color: white;
    transition: opacity 0.2s ease;

    inset: 0 auto 0 4.375rem;
    padding: .25rem .5rem;
    border-radius: .25rem;
    font-size: .75rem;
}

.info-hover::before {
    content: "";
    position: absolute;
    background-color: #000;
    transform: rotateZ(45deg);

    inset: 0;
    margin: auto 0 auto -0.625rem;
    width: .625rem;
    height: .625rem;
    clip-path: polygon(0 100%, 100% 100%, 0 0);
}

.extended button:hover+.info-hover,
.animating button:hover+.info-hover,
.extended button:focus-visible+.info-hover,
.animating button:focus-visible+.info-hover {
    opacity: 0;
    visibility: hidden;
}

button div {
    overflow: hidden;
}

button p {
    text-wrap: nowrap;
    font-size: .875rem;
    color: #1f2937;
    font-weight: 500;
    font-family: "Inter", sans-serif;
}

svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #4b5563;
}

.to-turn {
    transform: rotate(0deg);
    transition: transform 0.3s ease;
}

.to-turn.turned {
    transform: rotateZ(180deg);
}
</style>