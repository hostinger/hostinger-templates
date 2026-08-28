import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './styles/foundation.css';
import './styles/layout.css';
import './styles/playground.css';

createApp(App).use(router).mount('#app');
