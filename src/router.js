import VueRouter from 'vue-router';
import Home from './components/home';

const routes = [
  { path: '/', component: Home },
];

export default new VueRouter({
  routes,
  mode: 'history',
});
