/*
 * @Author: Hzh
 * @Date: 2021-04-23 10:13:38
 * @LastEditTime: 2021-04-23 15:27:20
 * @LastEditors: Hzh
 * @Description:
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
]
export default routes
