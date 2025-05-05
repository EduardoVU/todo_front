<script setup lang="ts"></script>
<template>
    <main class="hero">
        <div class="hero-content">
            <h1>Organiza tu día con <span>TodoAPP</span></h1>
            <p>Gestiona tus tareas de forma sencilla, rápida y desde cualquier lugar.</p>
            <div class="hero-buttons">
                <router-link to="/registro" class="btn-primary">Comienza ahora</router-link>
                <router-link to="/login" class="btn-secondary">Ya tengo cuenta</router-link>
            </div>
        </div>
        <picture class="hero-image">
            <source srcset="@/assets/productividad.webp" type="image/webp">
            <img src="@/assets/productividad.png" alt="Ilustración de organización de tareas" />
        </picture>
    </main>
</template>

<style scoped lang="scss">
@use "@/styles/mixins.scss" as m;

.hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: #f9fafb;
    font-family: 'Inter', sans-serif;

    padding: 2rem 1rem;

    @include m.tablet {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;

        padding: 4rem 2rem;
    }

    @include m.desktop {
        padding: 6rem 4rem;
    }

    @include m.desktopBig {
        padding: 8rem 6rem;
    }

    &-content {
        max-width: 37.5rem;

        h1 {
            font-size: 2rem;
            font-weight: 800;
            color: #111827;

            span {
                color: #6366f1;
            }

            @include m.tablet {
                font-size: 2.5rem;
            }

            @include m.desktop {
                font-size: 3rem;
            }

            @include m.desktopBig {
                font-size: 3.5rem;
            }
        }

        p {
            margin-top: 1rem;
            font-size: 1rem;
            color: #6b7280;
            text-wrap: pretty;

            @include m.tablet {
                font-size: 1.125rem;
            }

            @include m.desktop {
                font-size: 1.25rem;
            }

            @include m.desktopBig {
                font-size: 1.5rem;
            }
        }

        .hero-buttons {
            display: flex;
            flex-direction: column;

            margin-top: 2rem;
            gap: 1rem;

            @include m.tablet {
                flex-direction: row;
            }

            a {
                transition: background-color 600ms cubic-bezier(0.4, 0, 0.2, 1), color 600ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            .btn-primary {
                background-color: #6366f1;
                color: #ffffff;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-weight: 600;
                text-decoration: none;

                &:hover,
                &:focus-visible {
                    background-color: #4f46e5;
                }
            }

            .btn-secondary {
                background-color: transparent;
                color: #6366f1;
                font-weight: 600;

                padding: 0.75rem 1.5rem;
                border: .125rem solid #6366f1;
                border-radius: 0.5rem;

                &:hover,
                &:focus-visible {
                    background-color: #6366f1;
                    color: #ffffff;
                }
            }
        }
    }

    &-image {
        margin-top: 2rem;
        width: min(100%, 50.9375rem);

        img {
            width: min(100%, 50.9375rem);
            height: auto;

            @include m.tablet {
                min-width: 18.75rem;
            }
        }

        @include m.tablet {
            margin-top: 0;
        }
    }
}
</style>