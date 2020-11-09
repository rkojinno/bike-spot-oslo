import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Four04 from '../views/F04'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '*',
    name: '404',
    component: Four04,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
