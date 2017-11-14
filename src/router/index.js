import Vue from 'vue';
import Router from 'vue-router';
import home from '@/components/home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }
  ]
});
