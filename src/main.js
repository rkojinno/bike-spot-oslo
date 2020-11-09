import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import '../src/assets/css/bulma.min.css';
import '../src/assets/css/animate.css'
import '../src/assets/css/styles.scss';


//Styles

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
