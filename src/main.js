import Vue from 'vue';
import '@/configs/icons.js';
import '@/plugins/index.js';
import App from './App.vue';
// import './registerServiceWorker'
import store from './store';
import './styles.css';

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
