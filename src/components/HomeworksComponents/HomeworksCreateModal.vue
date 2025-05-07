<script setup lang="ts">
import { ref, onBeforeUnmount, reactive, computed } from 'vue';
import type { Homework } from '@/stores/Homeworks';
import { useHomeworksStore } from '@/stores/Homeworks';
import { useBenefactorStore } from '@/stores/Benefactor';
import { useUserStore } from '@/stores/Users';
import StatusMessage from '../utils/StatusMessage.vue';

const modal = ref<HTMLDialogElement | null>(null);

const emit = defineEmits<{
    (e: 'toEdit', id: number): void;
}>();

const dataToSend = reactive<Partial<Homework>>({
    user_id: undefined,
    title: '',
    description: undefined,
    due_date: '',
});

const homeworksStore = useHomeworksStore();

const benefactorStore = useBenefactorStore();
const benefactorAdded = computed(() => benefactorStore.added);

const userStore = useUserStore();
const identity = computed(() => userStore.user);

const statusState = reactive({
    status: '',
    message: ''
})

const clearStatus = () => {
    statusState.status = '';
    statusState.message = '';
}

const clickOutside = (e: MouseEvent) => {
    if (!modal.value?.open) return
    const rect = modal.value.getBoundingClientRect();

    const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (!isInDialog) closeModal();
}

const handleEsc = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    closeModal();
}

const openModal = () => {
    modal.value?.showModal()
    requestAnimationFrame(() => {
        window.addEventListener('click', clickOutside)
        window.addEventListener('keydown', handleEsc)
    })
}

const closeModal = () => {
    modal.value?.close()
    clearStatus();
    window.removeEventListener('click', clickOutside)
    window.removeEventListener('keydown', handleEsc)
    dataToSend.user_id = undefined;
    dataToSend.title = '';
    dataToSend.description = undefined;
    dataToSend.due_date = '';
}

const submitData = async () => {
    clearStatus();
    if (!dataToSend.description) {
        delete dataToSend.description
    }

    try {
        let userId: number | undefined;

        if (benefactorAdded.value && typeof benefactorAdded.value === 'object' && 'id' in benefactorAdded.value) {
            userId = (benefactorAdded.value as { id: number }).id;
        } else if (identity.value && identity.value.id !== undefined) {
            userId = identity.value.id;
        } else {
            throw { message: 'No se pudo obtener el userId' }
        }

        dataToSend.user_id = userId;

        const response = await homeworksStore.addItemHmw({
            option: 'homeworks',
            item: dataToSend
        });
        if (!response.success) throw response;

        if ('data' in response && response.data && 'id' in response.data) {
            emit('toEdit', response.data.id);
        } else {
            throw { message: 'Respuesta inválida del servidor' };
        }

        closeModal();

    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'message' in error) ? statusState.message = (error as { message: string }).message : statusState.message = 'Ha ocurrido un error desconocido';
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('click', clickOutside)
    window.removeEventListener('keydown', handleEsc)
})

defineExpose({ openModal }) 
</script>
<template>
    <dialog ref="modal">
        <div class="form">
            <h3>Crear Tarea</h3>
            <fieldset>
                <label for="title">Título</label>
                <input type="text" id="title" placeholder="Título" v-model="dataToSend.title">
            </fieldset>
            <fieldset>
                <label for="description">Descripción</label>
                <textarea id="description" placeholder="Descripción" v-model="dataToSend.description"></textarea>
            </fieldset>
            <fieldset>
                <label for="date">Fecha de entrega</label>
                <input type="date" id="date" v-model="dataToSend.due_date">
            </fieldset>

            <button @click="submitData">Crear Tarea</button>
        </div>
        <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
            class="status-inside" />
    </dialog>
</template>
<style scoped lang="scss">
dialog {
    padding: 0;
    border: none;
    background-color: #fff;
    color: #333;
    font-family: 'Inter', sans-serif;
    opacity: 0;
    transform: translateY(-1.875rem);
    transition-property: overlay, display, opacity, transform;
    transition-duration: 0.6s;
    transition-behavior: allow-discrete;

    border-radius: .75rem;
    box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.2);
    width: min(31.25rem, 90%);

    &[open] {
        opacity: 1;
        transform: translateY(0);

        @starting-style {
            opacity: 0;
            transform: translateY(-1.875rem);
        }

        &::backdrop {
            background-color: rgba(0, 0, 0, 0.4);

            @starting-style {
                background-color: rgba(0, 0, 0, 0);
                }
        }
    }

    &::backdrop {
        background-color: rgba(0, 0, 0, 0);
        transition: background-color 0.6s ease;
    }

    h3 {
        font-size: 2rem;
        text-align: center;
        margin: 0;
    }

}

.form {
    display: grid;
    gap: 1rem;
    padding: 2rem;
}

fieldset {
    border: none;
    display: grid;

    label {
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    input,
    textarea {
        transition: border-color 0.2s;

        padding: 0.5rem;
        border: .0625rem solid #ccc;
        border-radius: .375rem;
        font-size: 1rem;

        &:focus-visible {
            border-color: #007bff;
            outline: none;
        }
    }

    textarea {
        resize: none;
        min-height: 7.5rem;
    }
}

button {
    justify-self: end;
    font-weight: 600;
    background-color: #007bff;
    color: #fff;
    border: none;
    transition: background-color 0.2s;

    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    border-radius: .375rem;

    &:hover {
        background-color: #0056b3;
    }
}
</style>