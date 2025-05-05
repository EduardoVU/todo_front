<script setup lang="ts"></script>

<template>
    <section class="not-found">
        <div class="content">
            <h1>404</h1>
            <p>Página no encontrada</p>
            <router-link to="/" class="btn-primary">Volver al inicio</router-link>
        </div>
    </section>
</template>

<style scoped lang="scss">
@use "@/styles/mixins.scss" as m;

.not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 100lvh;
    background-color: #f9fafb;
    font-family: 'Inter', sans-serif;

    padding: 2rem;

    .content {
        max-width: 30rem;

        h1 {
            font-size: 6rem;
            font-weight: 900;
            color: #6366f1;
            margin-bottom: 1rem;
        }

        p {
            font-size: 1.5rem;
            color: #6b7280;
            margin-bottom: 2rem;
        }

        .btn-primary {
            background-color: #6366f1;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #4f46e5;
            }
        }
    }
}
</style>
