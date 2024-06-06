// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Auth from '../components/Auth.vue';
import signup from '../views/signup.vue'; // Updated path

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },
  {
    path: '/signup',
    name: 'signup',
    component: signup
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
