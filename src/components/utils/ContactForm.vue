<script setup lang="ts">
import { reactive } from 'vue';
import { useContactStore } from '@/stores/Contact'
import statusMessage from '@/components/utils/StatusMessage.vue'

const contactStore = useContactStore();

const data = reactive({
    name: '',
    email: '',
    message: ''
})

const statusState = reactive({
    status: '',
    message: ''
})

const clearStatus = () => {
    statusState.status = '';
    statusState.message = '';
}

const clearData = () => {
    data.name = '';
    data.email = '';
    data.message = '';
}


const submitData = async () => {
    clearStatus();

    try {
        if (!data.name || data.name.trim().length < 2) {
            throw { message: 'El nombre es obligatorio y debe tener al menos 2 caracteres.' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            throw { message: 'Ingresa un correo electrónico válido.' };
        }

        if (!data.message || data.message.trim().length < 10) {
            throw { message: 'El mensaje debe tener al menos 10 caracteres.' };
        }

        const response = await contactStore.contactMessage(data);

        statusState.status = 'success';
        statusState.message = 'Mensaje enviado correctamente.';

        clearData();

        setTimeout(() => {
            clearStatus();
        }, 5000);


    } catch (error) {
        statusState.status = 'error';

        (error && typeof error === 'object' && 'message' in error) ? statusState.message = (error as { message: string }).message : statusState.message = 'Ha ocurrido un error desconocido';
    }
}

</script>
<template>
    <section id="contacto" class="contacto">
        <h2>¿Tienes preguntas?</h2>
        <p>Escríbenos y nos pondremos en contacto contigo lo antes posible.</p>

        <form @submit.prevent="submitData">
            <input type="text" placeholder="Tu nombre" v-model="data.name" />
            <input type="email" placeholder="Tu correo" v-model="data.email" />
            <textarea placeholder="Tu mensaje" v-model="data.message"></textarea>

            <button type="submit" class="btn-primary">Enviar mensaje</button>

            <statusMessage v-if="statusState.status" :status="statusState.status" :message="statusState.message"
                class="status-inside" />
        </form>
    </section>
</template>
<style scoped lang="scss">
@use "@/styles/mixins.scss" as m;

.contacto {
    background-color: #f3f4f6;
    text-align: center;
    font-family: 'Inter', sans-serif;

    padding: 4rem 1rem;

    @include m.tablet {
        padding: 6rem 2rem;
    }

    @include m.desktop {
        padding: 8rem 4rem;
    }

    h2 {
        font-weight: 700;
        color: #111827;

        font-size: 2rem;

        @include m.desktop {
            font-size: 2.5rem;
        }
    }

    p {
        color: #6b7280;
        text-wrap: pretty;

        margin-bottom: 2rem;
        font-size: 1rem;

        @include m.desktop {
            font-size: 1.125rem;
        }
    }

    form {
        max-width: 36rem;
        margin: 0 auto;
        display: grid;
        gap: 1rem;

        input,
        textarea {
            font-family: inherit;
            resize: none;

            padding: 0.75rem 1rem;
            border: .0625rem solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;

            &:focus {
                outline: none;
                border-color: #6366f1;

                box-shadow: 0 0 0 .1875rem rgba(99, 102, 241, 0.3);
            }
        }

        textarea {
            height: 12.5rem;
        }

        .btn-primary {
            background-color: #6366f1;
            color: #FFF;
            font-weight: 600;
            text-decoration: none;
            border: none;
            transition: background-color 300ms ease, color 300ms ease;

            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;

            &:hover,
            &:focus-visible {
                background-color: #4f46e5;
            }
        }
    }
}
</style>