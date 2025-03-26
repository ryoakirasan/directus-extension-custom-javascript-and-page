//@ts-ignore
import ModuleComponent from './module.vue';

export default {
  id: 'ext-custom-scripts-page', // root URI
  name: 'Custom Scripts&Page',
  icon: 'handyman',
  routes: [
    {
      path: '',
      redirect: '/ext-custom-scripts-page/home' // Add this redirect
    },
    {
      path: 'home',
      props: { page: 'home' },
      component: ModuleComponent,
    },
    {
      name: 'page',
      path: ':page',
      props: true,
      component: ModuleComponent,
    },
  ],
};

