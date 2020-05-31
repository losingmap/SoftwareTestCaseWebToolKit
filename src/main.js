import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import iView from "view-design";
import axios from 'axios'

axios.defaults.baseURL = "/api";
Vue.use(iView);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
