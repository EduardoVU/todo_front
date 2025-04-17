import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/login.vue'
import authentication from '@/views/authentication.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import admin from '@/views/admin.vue'
import { validateToken } from '@/auth'
import { useUserStore } from '@/stores/Users'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: login,
    },
    {
      path: '/auth',
      name: 'auth',
      component: authentication,
      meta: { logged: true },

    },
    {
      path: '/administrador',
      name: 'administrador',
      component: admin,
      meta: { logged: true, authenticated: true },
    },
    {
      path: '/registro',
      name: 'registro',
      component: CreateAccount,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const requiresLogged = to.meta.logged;
  const requiresAuth = to.meta.authenticated;

  if (!requiresLogged && !requiresAuth) return next();

  // Verificamos si el usuario ya está logueado
  if (!userStore.state.logged) {
    const isLogged = await validateToken();
    userStore.setLogged(isLogged);
    if (!isLogged) return next('/');
  }

  // Verificamos si necesita estar autenticado
  if (requiresAuth && !userStore.state.authenticated) {
    return next('/auth');
  }

  next();
});

export default router
