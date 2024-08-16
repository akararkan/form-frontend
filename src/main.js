import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Import the router configuration
import { createPinia } from 'pinia';
const pinia = createPinia();

createApp(App)
  .use(router)  // Register the router with the app
  .use(pinia)
  .mount('#app');
