<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
</script>
<template>
    <header class="header" :class="{ 'open': open }">
        <a href="/">
            <p class="logo">Todo<span>APP</span></p>
        </a>

        <button type="button" class="hamburguer-icon" :class="{ 'open': open }" @click="open = !open">
            <svg viewBox="0 0 32 32">
                <path class="line line-top-bottom"
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22">
                </path>
                <path class="line" d="M7 16 27 16"></path>
            </svg>
        </button>

        <nav class="nav">
            <div class="nav-wrapper">
                <router-link to="login">Login</router-link>
                <router-link to="registro">Crea tu cuenta</router-link>
                <router-link to="administrador">Mi cuenta</router-link>
                <a href="#contacto">Contáctanos</a>
            </div>
        </nav>
    </header>
</template>
<style scoped lang="scss">
@use "@/styles/mixins.scss" as m;

header {
    font-family: 'Inter', sans-serif;
    background-color: rgba(255, 255, 255, 0.3);
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
    display: grid;
    grid-template-columns: auto 1fr;

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 1rem;
    border-bottom: .0625rem solid rgba(255, 255, 255, 0.1);

    @include m.tablet {
        padding: 1rem 2rem;
    }

    @include m.desktop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 3rem;
    }

    @include m.desktopBig {
        padding: 1.5rem 5rem;
    }
}

.logo {
    color: #111827;
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;

    @include m.tablet {
        font-size: 1.75rem;
    }

    @include m.desktop {
        font-size: 2rem;
    }

    @include m.desktopBig {
        font-size: 2.25rem;
    }
}

.logo span {
    font-weight: 900;
    color: #6366f1;
}

.hamburguer-icon {
    background-color: transparent;
    border: 0;
    padding: .125rem;
    justify-self: end;

    svg {
        height: 4.25rem;
        transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .line {
        fill: none;
        stroke: #6366f1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 3;
        transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
            stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);

        &-top-bottom {
            stroke-dasharray: 12 63;
        }
    }

    @include m.desktop {
        display: none;
    }
}

.hamburguer-icon.open {

    svg {
        transform: rotate(-45deg);

        .line-top-bottom {
            stroke-dasharray: 20 300;
            stroke-dashoffset: -32.42;
        }
    }
}

.nav {
    grid-column: 1 / -1;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 600ms cubic-bezier(0.4, 0, 0.2, 1);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;


    @include m.desktop {
        display: flex;
        grid-template-rows: none;
        height: auto;
    }
}

.nav-wrapper {
    overflow: hidden;
    display: grid;
    justify-items: end;

    gap: .5rem;

    @include m.desktop {
        display: flex;
        gap: 2.5rem;
        padding: .125rem;
    }

    a {
        font-size: 1rem;
        font-weight: 500;
        color: #111827;
        transition: color 0.3s ease;

        &:hover, &:focus-visible {
            color: #6366f1;
        }

        @include m.tablet {
            font-size: 1.1rem;
        }

        @include m.desktop {
            font-size: 1.1rem;
        }

        @include m.desktopBig {
            font-size: 1.25rem;
        }
    }
}

.open .nav {
    grid-template-rows: 1fr;
}
</style>