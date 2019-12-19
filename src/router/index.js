import Vue from 'vue';
import Router from 'vue-router'
Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../pages/index.vue'),
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default new Router({ routes })