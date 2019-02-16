import Vue from 'vue';
import App from './App';
import router from './router';
import Axios from 'axios';
import { ACCESS_TOKEN } from './constant/global';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

Axios.defaults.baseURL = 'https://api.github.com/';
Axios.defaults.headers.common['Authorization'] = `Bearer ${ACCESS_TOKEN}`;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
