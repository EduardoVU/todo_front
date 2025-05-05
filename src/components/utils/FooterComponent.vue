<script setup lang="ts">
import dayjs from 'dayjs'

const year = dayjs().format('YYYY');
</script>
<template>
  <footer class="footer">
    <div class="footer-top">
      <a href="/">
        <p class="logo">Todo<span>APP</span></p>
      </a>

      <nav class="footer-nav">
        <router-link to="login">Login</router-link>
        <router-link to="registro">Crea tu cuenta</router-link>
        <router-link to="administrador">Administrador</router-link>
        <a href="#contacto">Contáctanos</a>
      </nav>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ year }} TodoAPP. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use "@/styles/mixins.scss" as m;

.footer {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  border-top: .0625rem solid #e5e7eb;
  padding: 2rem 1rem;

  @include m.tablet {
    padding: 2rem 2rem;
  }

  @include m.desktop {
    padding: 2rem 3rem;
  }

  @include m.desktopBig {
    padding: 3rem 5rem;
  }
}

.footer-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @include m.desktop {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #111827;

  @include m.tablet {
    font-size: 1.75rem;
  }

  @include m.desktop {
    font-size: 2rem;
  }

  @include m.desktopBig {
    font-size: 2.25rem;
  }

  span {
    font-weight: 900;
    color: #6366f1;
  }
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  @include m.desktop {
    flex-direction: row;
    gap: 2.5rem;
  }

  a {
    font-size: 1rem;
    font-weight: 500;
    color: #111827;
    transition: color 0.3s ease;

    &:hover,
    &:focus-visible {
      color: #6366f1;
    }

    @include m.tablet {
      font-size: 1.1rem;
    }

    @include m.desktopBig {
      font-size: 1.25rem;
    }
  }
}

.footer-bottom {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>