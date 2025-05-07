<script setup lang="ts">
import { useBenefactorStore } from '@/stores/Benefactor';
import { useUserStore } from '@/stores/Users';
import { computed, onMounted, reactive } from 'vue';
import statusMessage from '@/components/utils/StatusMessage.vue'

const benefactorStore = useBenefactorStore();
const benefactorAdded = computed(() => benefactorStore.added);
const benefactorData = computed(() => benefactorStore.data);

const userStore = useUserStore();

const dataToSubmit = reactive({
    id: undefined as number | undefined,
    name: '' as string,
    last_name: '' as string,
    email: '' as string,
    password: '' as string | null,
});

const statusState = reactive({
    status: '',
    message: ''
})

const clearStatus = () => {
    statusState.status = '';
    statusState.message = '';
}

const submitForm = async () => {
    clearStatus();

    if (!dataToSubmit.password) {
        delete (dataToSubmit as any).password;
    }

    try {
        const response = await benefactorStore.editItemBnf({
            option: 'users',
            item: dataToSubmit
        });

        if (!response.success) throw response;

        await getInfo();

        if ('data' in response) userStore.setUser(response.data);

        statusState.status = 'success';
        statusState.message = 'Perfil editado con éxito';

        setTimeout(() => clearStatus(), 5000);

    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'message' in error) ? statusState.message = (error as { message: string }).message : statusState.message = 'Ha ocurrido un error desconocido';
    }
};

const getInfo = async () => {
    if (!benefactorAdded.value) return
    await benefactorStore.getInfoByIdBnf({ option: 'users', id: benefactorAdded.value });
    const source = benefactorData.value as Partial<typeof dataToSubmit>;
    Object.assign(dataToSubmit, source);
}

onMounted(async () => await getInfo());

</script>
<template>
    <form @submit.prevent="submitForm" class="formulario">
        <h2>Editar Mi Perfil</h2>
        <fieldset>
            <label for="name">Nombre:</label>
            <input v-model="dataToSubmit.name" type="text" placeholder="Nombre" id="name" />
        </fieldset>

        <fieldset>
            <label for="last_name">Apellido:</label>
            <input v-model="dataToSubmit.last_name" type="text" placeholder="Apellido" id="last_name" />
        </fieldset>

        <fieldset>
            <label for="email">Correo electrónico:</label>
            <input v-model="dataToSubmit.email" type="email" placeholder="Correo" id="email" />
        </fieldset>

        <fieldset>
            <label for="password">Contraseña (opcional):</label>
            <input v-model="dataToSubmit.password" type="password" placeholder="Nueva contraseña" id="password" autocomplete="new-password"
            name="new-password" />
        </fieldset>

        <button type="submit" class="btn-primary">Guardar cambios</button>

        <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
            class="status-inside" />
    </form>
</template>
<style scoped lang="scss">
input:-webkit-autofill {
    -webkit-text-fill-color: #000 !important;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-background-clip: text;
    -webkit-text-fill-color: #ffffff;
    transition: background-color 5000s ease-in-out 0s;
}

h2 {
    grid-column: 1 / -1;
    margin: 0;
}

.formulario {
    display: grid;
    background-color: #fff;
    font-family: 'Segoe UI', sans-serif;

    gap: 1.5rem;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 .5rem 1.25rem rgba(0, 0, 0, 0.05);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15.625rem), 1fr));
    margin: 2rem auto;
    width: min(100%, 50rem);

    fieldset {
        display: flex;
        flex-direction: column;
        background: #f9fafb;
        border: none;
        transition: background-color 0.3s ease;

        gap: 0.5rem;
        padding: 1rem;
        border-radius: 0.75rem;

        &:hover,
        &:focus-visible {
            background: #f3f4f6;
        }

        label {
            font-weight: 600;
            color: #1f2937;

            font-size: 0.95rem;
        }

        input {
            transition: border 0.3s, box-shadow 0.3s;

            padding: 0.75rem 1rem;
            border: .0625rem solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;

            &:focus {
                border-color: #3b82f6;
                outline: none;
                background-color: #FFF;

                box-shadow: 0 0 0 .1875rem rgba(59, 130, 246, 0.3);
            }

            &::placeholder {
                color: #9ca3af;
            }
        }
    }

    .btn-primary {
        grid-column: 1 / -1;
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
            transform: scale(1.02);
        }
    }
}

.status-inside {
    grid-column: 1 / -1;
}
</style>