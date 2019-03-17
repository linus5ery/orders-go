import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import VueRx from 'vue-rx'
import { Observable } from 'rxjs'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VueRx, {
  Observable
})

import Shop from './components/shop/Shop.vue'
import Orders from './components/orders/Orders.vue'
import Payment from './components/Payment.vue'
import PaymentServices from './components/PaymentServices.vue'

const routes = [
  { 
    path: '/', 
    name: 'Shop', 
    component: Shop 
  },
  { path: '/orders', 
    name: 'Orders', 
    component: Orders,
    props: true 
  },
  { 
    path: '/payment/:orderId', 
    name: 'Payment', 
    component: Payment 
  },
  {
    path: '/paymentServices', 
    name: 'Payment Services', 
    component: PaymentServices 
  },
]

const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history',
  linkExactActiveClass: "active"
})

const redirect = {    
  shop () { 
    router.push({name: 'Shop'}); 
  },
  orders () { 
    router.push({name: 'Orders'}); 
  },
  payment (_id) { 
    router.push({name: 'Payment', params: {orderId: _id}});
  },
  paymentServices () { 
    router.push({name: 'Payment Services'});
  },
}

Vue.config.productionTip = false
Vue.prototype.orderApiUrl = 'http://localhost:3000/orders'
Vue.prototype.paymentApiUrl = 'http://localhost:3030/payments'
Vue.prototype.redirect = redirect

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
