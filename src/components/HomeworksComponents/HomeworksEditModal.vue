<script setup lang="ts">
import { ref, onBeforeUnmount, reactive, computed } from 'vue';
import { useHomeworksStore } from '@/stores/Homeworks';
import { useTaskStore } from '@/stores/Tasks';
import type { Homework } from '@/stores/Homeworks';
import type { Tasks } from '@/stores/Tasks';
import StatusMessage from '../utils/StatusMessage.vue';
import { TaskStatusEnum } from '@/stores/Tasks';

const modalEdit = ref<HTMLDialogElement | null>(null);


const homeworkStore = useHomeworksStore();
const homeworkStoreAdded = computed(() => homeworkStore.added);
const homeworkToEdit = reactive<Partial<Homework>>({});

const taskStore = useTaskStore();
const taskStoreData = computed(() => taskStore.data);
const tasksToEdit = reactive<Partial<Tasks>[]>([])

const statusState = reactive({
    status: '',
    message: ''
})


const emit = defineEmits<{
    (event: 'allFine'): void;
}>();

const pushItem = () => {
    tasksToEdit.push({
        title: '',
        due_date: '',
        status: TaskStatusEnum.pendiente,
        homework_id: homeworkToEdit.id,
    });
}

const changeStatus = (index: number, value: TaskStatusEnum) => {
    tasksToEdit[index].status = value;
}

const deleteByIndex = (index: number) => {
    if (index >= 0 && index < tasksToEdit.length) {
        tasksToEdit.splice(index, 1);
    }
}

const submitData = async () => {
    try {
        const original = homeworkStoreAdded.value;
        if (!original) throw { 'message': 'No hay tarea original para comparar' };

        const hasChanged =
            homeworkToEdit.title !== original.title ||
            homeworkToEdit.description !== original.description ||
            homeworkToEdit.due_date !== original.due_date;

        if (hasChanged) {
            const response = await homeworkStore.editItemHmw({ option: 'homeworks', item: homeworkToEdit });
            if (!response.success) throw response;
        }

        const firstFilter = tasksToEdit.filter((item: any) => item.title && item.due_date && item.status);

        const toCreate = firstFilter.filter((item: any) => !item.id);
        const toUpdate = firstFilter.filter((item: any) => item.id);

        const toDelete = taskStoreData.value && Array.isArray(taskStoreData.value)
            ? taskStoreData.value.filter((task: any) =>
                !firstFilter.some((edited: any) => edited.id === task.id)
            )
            : [];

        const promiseArray = [
            toCreate.length > 0 ? createTasks(toCreate) : Promise.resolve(true),
            toUpdate.length > 0 ? updateTasks(toUpdate) : Promise.resolve(true),
            toDelete.length > 0 ? deleteTasks(toDelete) : Promise.resolve(true)
        ];

        const tasksResponse = await Promise.all(promiseArray);

        const validate = tasksResponse.every(value => value === true);

        if (!validate) throw {'message': 'Ha ocurrido un error con las actividades'};

        emit('allFine');
        closeModalEdit();

    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'message' in error) ? statusState.message = (error as { message: string }).message : statusState.message = 'Ha ocurrido un error desconocido';
    }
}

const createTasks = async (items: Partial<Tasks>[]) => {
    const responses = [];

    for (const item of items) {
        try {
            const response = await taskStore.addItemTsk({ option: 'tasks', item });
            if ('id' in response) {
                responses.push({ success: !!response.id });
            } else {
                responses.push({ success: false, error: response.message || 'No id returned' });
            }

        } catch (error) {
            responses.push({ success: false, error });
        }
    }

    return responses.every(response => response.success === true);
}

const updateTasks = async (items: Partial<Tasks>[]) => {
    const responses = [];

    for (const item of items) {
        try {
            const response = await taskStore.editItemTsk({ option: 'tasks', item });
            if ('id' in response) {
                responses.push({ success: !!response.id });
            } else {
                responses.push({ success: false, error: response.message || 'No id returned' });
            }
        } catch (error) {
            responses.push({ success: false, error });
        }
    }

    return responses.every(response => response.success === true);
}

const deleteTasks = async (items: Partial<Tasks>[]) => {
    const responses = [];
    for (const item of items) {
        try {
            const response = await taskStore.deleteItemTsk({ option: 'tasks', id: item.id });
            responses.push(response)
        } catch (error) {
            responses.push({ success: false, error });
        }
    }

    return responses.every(response => response.success === true);
}

const clearStatus = () => {
    statusState.status = '';
    statusState.message = '';
}

const clickOutside = (e: MouseEvent) => {
    if (!modalEdit.value?.open) return
    const rect = modalEdit.value.getBoundingClientRect();

    const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;


    if (!isInDialog) closeModalEdit();
}

const handleEsc = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    closeModalEdit();
}

const openModal = () => {
    modalEdit.value?.showModal()
    requestAnimationFrame(async () => {
        window.addEventListener('click', clickOutside)
        window.addEventListener('keydown', handleEsc)

        const addedHomework = homeworkStoreAdded.value;

        if (addedHomework) {
            Object.assign(homeworkToEdit, {
                ...addedHomework,
                due_date: addedHomework.due_date?.slice(0, 10)
            });

            await taskStore.getInfoByIdTsk({ option: 'tasks/homework', id: addedHomework.id });

            const tasks = taskStoreData.value;
            if (Array.isArray(tasks)) {
                tasksToEdit.splice(
                    0,
                    tasksToEdit.length,
                    ...tasks.map(task => ({
                        ...task,
                        due_date: task.due_date?.slice(0, 10),
                    }))
                );
            }
        }
    })
}

const closeModalEdit = () => {
    modalEdit.value?.close()
    clearStatus();
    window.removeEventListener('click', clickOutside)
    window.removeEventListener('keydown', handleEsc)
}

onBeforeUnmount(() => {
    window.removeEventListener('click', clickOutside)
    window.removeEventListener('keydown', handleEsc)
})

defineExpose({ openModal }) 
</script>
<template>
    <dialog ref="modalEdit">
        <div class="form">
            <h2>Mi tarea</h2>
            <input type="text" placeholder="Título" v-model="homeworkToEdit.title">
            <textarea placeholder="Descripción" v-model="homeworkToEdit.description"></textarea>
            <input type="date" v-model="homeworkToEdit.due_date">

            <div class="form__tasks">
                <h3>Actividades</h3>
                <div v-for="(task, index) in tasksToEdit" :key="index">
                    <input type="text" placeholder="Título" v-model="task.title">
                    <input type="date" v-model="task.due_date">
                    <button class="select" :popovertarget="`popover_${index}`"
                        :style="`anchor-name: --select-button-${index};`">
                        <svg v-if="task.status === TaskStatusEnum.pendiente" :style="{ '--state': '#FFC107' }"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M12 9v4"></path>
                            <path d="M12 16v.01"></path>
                        </svg>

                        <svg v-if="task.status === TaskStatusEnum.completada" :style="{ '--state': '#4CAF50' }"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M9 12l2 2l4 -4"></path>
                        </svg>

                        <svg v-if="task.status === TaskStatusEnum.atrasada" :style="{ '--state': '#d00' }"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M9 12l6 0"></path>
                        </svg>

                        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"
                            stroke-width="2">
                            <path d="M17 13v-6l-5 4l-5 -4v6l5 4z"></path>
                        </svg>
                    </button>

                    <div role="menu" popover class="popover" :id="`popover_${index}`"
                        :style="`position-anchor: --select-button-${index};`">
                        <button @click="changeStatus(index, TaskStatusEnum.atrasada)">Atrasada</button>
                        <button @click="changeStatus(index, TaskStatusEnum.pendiente)">Pendiente</button>
                        <button @click="changeStatus(index, TaskStatusEnum.completada)">Completada</button>
                    </div>

                    <button class="eliminar action-btn" @click="deleteByIndex(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                            <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z">
                            </path>
                            <path d="M9 9l6 6m0 -6l-6 6"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="buttons__wrapper">
                <button class="add-task" @click="pushItem">Agregar actividad</button>
                <button class="submit" @click="submitData">Guardar cambios</button>
            </div>
            <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
                class="status-inside" />
        </div>
    </dialog>
</template>
<style scoped lang="scss">
dialog {
    max-height: unset;
    transform: translateX(100%);
    margin: auto 0 auto auto;
    transition-property: overlay, display, transform;
    transition-duration: 0.6s;
    transition-behavior: allow-discrete;
    background-color: #fff;
    color: #333;
    height: auto;
    border: none;
    font-family: 'Inter', sans-serif;

    width: min(37.5rem, 100%);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 .625rem 2.5rem rgba(0, 0, 0, 0.25);

    &[open] {
        transform: translateX(0);

        @starting-style {
            transform: translateX(100%);
        }

        &::backdrop {
            background-color: rgba(0, 0, 0, 0.4);
            transform: translateY(0%);

            @starting-style {
                transform: translateY(100%);
            }
        }
    }

    &::backdrop {
        transform: translateY(-100%);
        transition: transform 0.6s ease;
    }
}

.form {
    display: grid;
    gap: 1rem;

    input,
    textarea {
        width: 100%;
        font-family: inherit;

        padding: 0.75rem 1rem;
        border: .0625rem solid #ccc;
        border-radius: 0.5rem;
        font-size: 1rem;
    }

    textarea {
        min-height: 5rem;
        resize: none;
    }
}

.form__tasks {
    display: grid;
    gap: 1rem;

    >div {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto auto;
        align-items: center;
        background-color: #f9f9f9;

        gap: 0.5rem;
        padding: 0.5rem;
        border: .0625rem solid #e0e0e0;
        border-radius: 0.5rem;
    }

    p {
        margin: 0;
        font-weight: 500;
        text-align: center;
    }

    .action-btn {
        background-color: transparent;
        border: none;
        color: #666;

        font-size: 1.2rem;
        padding: 0.25rem;

        &:hover,
        &:focus-visible {
            color: #d00;
        }

        &.finalizar:hover,
        &.finalizar:focus-visible {
            color: #0a0;
        }
    }
}

.buttons__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11.5625rem), 1fr));
    gap: .5rem;

    button {
        font-weight: 600;
        border: none;
        transition: background-color 0.3s;

        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;

        &.add-task {
            background-color: #eee;
            color: #333;

            &:hover,
            &:focus-visible {
                background-color: #ddd;
            }
        }

        &.submit {
            background-color: #0077ff;
            color: white;

            &:hover,
            &:focus-visible {
                background-color: #005fd1;
            }
        }
    }
}

.select {
    background-color: transparent;

    border: .0625rem solid #ddd;

    svg {
        color: var(--state, #000)
    }
}

.popover {
    margin: 0;
    position: absolute;
    inset: auto;
    top: anchor(bottom);
    right: anchor(right);
    background-color: #FFF;
    color: #333;

    min-width: 10rem;
    font-size: 0.875rem;
    border: .0625rem solid #ddd;
    border-radius: 0.5rem;
    box-shadow: 0 .25rem .5rem rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0;

    button {
        width: 90%;
        margin: 0 auto;
        padding: 0.5rem 1rem;
        transition: background-color 0.2s;
        background-color: #FFF;
        border: .0625rem solid #ddd;


        &:hover,
        &:focus-visible {
            background-color: #f5f5f5;
        }
    }

}

.popover:popover-open {
    display: grid;
    gap: .125rem;
}
</style>