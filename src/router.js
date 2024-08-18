// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import InitialPage from './views/InitialPage.vue';
import AdminPanel from './views/AdminPanel.vue';
import UserPanel from './views/UserPanel.vue';
import Login from './views/Login.vue';
import Response from './views/Response.vue';
import IdCard from './views/IdCard.vue';
import IdCardsDashBoard from './views/IdCardsDashBoard.vue';
import QrCode from "./views/QrCode.vue"

import {jwtDecode} from 'jwt-decode';

const routes = [
  { path: '/', component: InitialPage },
  { path: '/login', component: Login },
  { path: '/admin-dashboard', component: AdminPanel, meta: { requiresAuth: true } },
  { path: '/user', component: UserPanel },
  {path: "/responses", component: Response},
  {path: "/id-card" , component: IdCard},
  {path: "/idCard-dashboard", component: IdCardsDashBoard},
  {path: "/qr-page" , component: QrCode}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (to.meta.requiresAuth) {
    if (!token || !isAuthenticated) {
      return next({ path: '/login', query: { timeout: true } });
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        return next({ path: '/login', query: { timeout: true } });
      }

      return next();
    } catch (error) {
      console.error('Token decode error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      return next({ path: '/login', query: { timeout: true } });
    }
  }

  next();
});

export default router;
