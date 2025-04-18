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
      path: ':page',
      component: ModuleComponent,
      props: (route) => ({
        page: route.params.page || 'home'
      })
    }
  ],
};

