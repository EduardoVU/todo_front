<script setup lang="ts">
import { useBenefactorStore } from '@/stores/Benefactor';
import { useUserStore } from '@/stores/Users';
import { useHomeworksStore } from '@/stores/Homeworks';
import type { Homework } from '@/stores/Homeworks';
import dayjs from 'dayjs';
import { computed, onMounted, reactive, ref } from 'vue';
import StatusMessage from '../utils/StatusMessage.vue';
import HomeworksCreateModal from './HomeworksCreateModal.vue';
import type { ComponentPublicInstance } from 'vue'
import HomeworksEditModal from './HomeworksEditModal.vue';

const benefactorStore = useBenefactorStore();
const benefactorAdded = computed(() => benefactorStore.added);

const userStore = useUserStore();
const identity = computed(() => userStore.user);

const homeworksStore = useHomeworksStore();
const homeworksData = computed<Homework[]>(() => {
    const data = homeworksStore.data;
    if (!data) return [];
    const value = Array.isArray(data) ? data : [data]
    const result = filter.value ? value.filter((item) => item.status === filter.value) : value;
    return result;
});

const statusMap = {
    atrasada: 'atrasadas',
    pendiente: 'pendientes',
    completada: 'completadas',
};

const getMessage = computed(() => {
    return (statusMap as Record<string, string>)[filter.value] || 'asignadas';
});

const statusState = reactive({
    status: '',
    message: ''
})

const headers = reactive(['Título', 'Descripción', 'Fecha de entrega', 'Status']);
const filter = ref('')

const setFilter = (value: string) => filter.value = filter.value === value ? '' : value;

const getInfo = async () => {
    const id = benefactorAdded.value ? benefactorAdded.value : identity.value?.id;
    if (id === null) return;

    const result = await homeworksStore.getInfoByIdHmw({ option: 'homeworks/user', id });
};

const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const formatTime = (dueDate: string) => dayjs(dueDate).format('DD-MM-YYYY');

const clearStatus = () => {
    statusState.status = '';
    statusState.message = '';
}

const emitCreateHomework = async (id: number) => {
    await getInfo();
    editModalFather(id);
}

const deleteHomework = async (id: number) => {
    clearStatus();

    try {
        const response = await homeworksStore.deleteItemHmw({ option: 'homeworks', id });

        if (!response.success) throw response;
        await getInfo();

        statusState.status = 'success';
        statusState.message = response.message;

        setTimeout(() => clearStatus(), 5000);


    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'detail' in error) ? statusState.message = (error as { detail: string }).detail : statusState.message = 'Ha ocurrido un error desconocido';
    }
}

const finishHomework = async (field: any) => {
    clearStatus();
    try {
        const item: Partial<typeof field> = { ...field };
        item.status = 'completada';
        delete item.title
        delete item.description
        delete item.due_date

        const response = await homeworksStore.editItemHmw({ option: 'homeworks', item });
        if (!response.success) throw response;

        await getInfo();

        statusState.status = 'success';
        statusState.message = response.message;

        setTimeout(() => clearStatus(), 5000);

    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'detail' in error) ? statusState.message = (error as { detail: string }).detail : statusState.message = 'Ha ocurrido un error desconocido';
    }
}

type HomeworksCreateModalInstance = ComponentPublicInstance<{
    openModal: () => void
}>

const createModalComponent = ref<HomeworksCreateModalInstance | null>(null)
const openModalFather = () => {
    createModalComponent.value?.openModal()
}

const editModalComponent = ref<HomeworksCreateModalInstance | null>(null)
const editModalFather = (id: number) => {
    const item = homeworksData.value.find(hw => hw.id === id) ?? null;
    homeworksStore.setAdded(item);
    editModalComponent.value?.openModal()
}

onMounted(async () => await getInfo());

</script>

<template>
    <HomeworksCreateModal ref="createModalComponent" @toEdit="emitCreateHomework" />
    <HomeworksEditModal ref="editModalComponent"  @allFine="getInfo"/>
    <div class="container">
        <h2>Mis Tareas</h2>
        <div class="controls-wrapper">
            <button type="button" @click="openModalFather">Crear Tarea</button>

            <div>
                <p>Filtrar por:</p>

                <div class="radio-buttons">
                    <div>
                        <button type="button" id="atrasada" @click="setFilter('atrasada')"
                            :class="{ 'active': filter === 'atrasada' }"></button>
                        <label for="atrasada">Atrasada</label>
                    </div>
                    <div>
                        <button type="button" id="pendiente" @click="setFilter('pendiente')"
                            :class="{ 'active': filter === 'pendiente' }"></button>
                        <label for="pendiente">Pendiente</label>
                    </div>
                    <div>
                        <button type="button" id="completada" @click="setFilter('completada')"
                            :class="{ 'active': filter === 'completada' }"></button>
                        <label for="completada">Completada</label>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="homeworksData.length === 0">
            <p>No tienes tareas {{ getMessage }}</p>
        </div>

        <div v-else class="table">
            <div class="table__heads">
                <div v-for="(head, index) in headers" :key="index">
                    <p>{{ head }}</p>
                </div>
            </div>
            <div class="table__data">
                <div class="table__data__row" v-for="(field, indice) in homeworksData" :key="indice">
                    <div class="title">
                        <p>{{ field.title ?? '-' }}</p>
                    </div>
                    <div>
                        <p>{{ field.description ?? '-' }}</p>
                    </div>
                    <div>
                        <p>{{ field.due_date ? formatTime(field.due_date) : '-' }}</p>
                    </div>
                    <div>
                        <p>{{ field.status ? capitalize(field.status) : '-' }}</p>
                    </div>

                    <div class="button-wrapper">
                        <button type="button" @click="deleteHomework(field.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24"
                                height="24" stroke-width="2">
                                <path
                                    d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z">
                                </path>
                                <path d="M9 9l6 6m0 -6l-6 6"></path>
                            </svg>
                        </button>

                        <div class="message-wrapper">
                            <p>Eliminar</p>
                        </div>
                    </div>

                    <div class="button-wrapper">
                        <button type="button" @click="editModalFather(field.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24"
                                height="24" stroke-width="2">
                                <path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v4"></path>
                                <path d="M18.42 15.61a2.1 2.1 0 1 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z"></path>
                            </svg>
                        </button>

                        <div class="message-wrapper">
                            <p>Editar</p>
                        </div>
                    </div>

                    <div class="button-wrapper">
                        <button type="button" @click="finishHomework(field)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24"
                                height="24" stroke-width="2">
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                <path d="M9 12l2 2l4 -4"></path>
                            </svg>
                        </button>

                        <div class="message-wrapper">
                            <p>Finalizar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
            class="status-inside" />
    </div>
</template>

<style scoped lang="scss">
.container {
    font-family: 'Inter', sans-serif;
    margin: 0 auto;

    width: min(100%, 77.5rem);
    padding: 0 1.25rem;
}

.table {
    width: 100%;

    margin: 1.25rem 0;
    box-shadow: 0 .125rem .3125rem rgba(0, 0, 0, 0.1);
    border-spacing: 0 .625rem;
}

.table__heads {
    background-color: #f5f5f5;
    display: grid;

    grid-template-columns: repeat(4, 1fr) repeat(3, 3.125rem);
    padding: .625rem .9375rem;
    gap: .3125rem;
}

.table__heads p {
    font-weight: bold;
    color: #333;
    text-align: center;
    margin: 0;
}

.table__data__row {
    display: grid;
    align-items: center;
    background-color: #fff;

    grid-template-columns: repeat(4, 1fr) repeat(3, 3.125rem);
    gap: .3125rem;
    padding: .5rem .9375rem;
    border-bottom: .0625rem solid #ddd;
}

.table__data__row:last-child {
    border-bottom: none;
}

.table__data__row>div {
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;

    margin: .3125rem 0;

    &.title {
        text-align: start;
    }

}

.table__data__row div p {
    margin: 0;
    color: #555;

    font-size: 0.9rem;
}

.table__data__row div p:not(:last-child) {
    padding-right: .625rem;
}

.table button {
    background-color: transparent;
    border: none;
    border-radius: 50%;
    display: grid;
    place-items: center;

    width: 1.875rem;
    height: 1.875rem;
    margin: 0 .1875rem;
    padding: 0;
}

button:hover,
button:focus-visible {
    background-color: #f5f5f5;
    transition: background-color 0.3s ease;
}

svg {
    transition: transform 0.3s ease;

    width: 1.125rem;
    height: 1.125rem;
}

button:focus {
    outline: none;
}

.table__data__row div:nth-last-of-type(3) svg {
    color: #F44336;
}

.table__data__row div:nth-last-of-type(2) svg {
    color: #FFC107;
}

.table__data__row div:nth-last-of-type(1) svg {
    color: #4CAF50;
}

.table__data__row button:hover svg,
.table__data__row button:focus-visible svg {
    transform: scale(1.2);
}

.controls-wrapper>button {
    background-color: #3b82f6;
    color: #FFF;
    font-weight: bold;
    border: none;
    transition: background-color 0.2s ease, transform 0.1s;

    padding: 0.85rem 2rem;
    border-radius: 0.75rem;
    font-size: 1rem;

    &:hover,
    &:focus-visible {
        background-color: #2563eb;
    }
}

.radio-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;

    div {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: .3125rem;
        align-items: center;
    }

    button {
        background-color: transparent;
        border-radius: 100%;
        border: .0625rem solid #555;
        width: .9375rem;
        height: .9375rem;
        transition: box-shadow 0.3s ease;

        &:hover,
        &:focus-visible {
            box-shadow: 0 0 0 .1875rem rgba(59, 130, 246, 0.3);
        }


        &.active {
            background-image: radial-gradient(#6366f1 50%, transparent 55%);
        }
    }
}

.table__data__row .button-wrapper {
    position: relative;
    overflow: visible;
    display: grid;
    place-items: center;


    div {
        background-color: #1f2937;
        position: absolute;
        opacity: 0;
        pointer-events: none;
        z-index: 2;
        transform: translateY(2.5rem);
        transition: opacity 0.3s ease, transform 0.3s ease;

        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        top: -2.5rem;

        p {
            font-size: 0.75rem;
            color: #FFF;
        }
    }

    div::before {
        content: "";
        position: absolute;
        margin: 0 auto;
        background-color: #1f2937;
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
        transform: rotateZ(45deg);

        width: .625rem;
        height: .625rem;
        inset: auto 0 -0.4375rem;

    }

    button:hover+div,
    button:focus-visible+div {
        opacity: 1;
        transform: translateY(0rem);
    }
}
</style>