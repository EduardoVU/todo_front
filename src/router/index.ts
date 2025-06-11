import { createRouter, createWebHistory } from 'vue-router'
import { validateToken } from '@/auth'
import { useUserStore } from '@/stores/Users'

import Login from '@/views/Login.vue'
import Authentication from '@/views/Authentication.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import Home from '@/views/Home.vue'
import Error404 from '@/views/Error404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login, 
    },
    {
      path: '/auth',
      name: 'auth',
      component: Authentication,
      meta: { logged: true },

    },
    {
      path: '/administrador',
      name: 'administrador',
      component: AdminLayout,
      meta: { logged: true,  },
      //authenticated: true
    },
    {
      path: '/registro',
      name: 'registro',
      component: CreateAccount,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Error404',
      component: Error404,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const requiresLogged = to.meta.logged;
  const requiresAuth = to.meta.authenticated;

  if (!requiresLogged && !requiresAuth) return next();

  // Verificamos si el usuario ya está logueado
  if (!userStore.logged) {
    const isLogged = await validateToken();
    userStore.setLogged(isLogged);
    if (!isLogged) return next('/login');
  }

  // Verificamos si necesita estar autenticado
  if (requiresAuth && !userStore.authenticated) {
    return next('/auth');
  }

  next();
});

export default router
