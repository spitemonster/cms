import Vue from 'Vue'
import Router from 'vue-router'
import App from '../vue/App.vue'
import Sortable from 'vue-sortable'
import createTemplate from '../vue/components/createTemplate.vue'
import fieldCard from '../vue/components/fieldCard.vue'

const Bus = new Vue()

export default Bus

Vue.use(Sortable)
Vue.use(Router)

const test = { template: '<div>foo</div>' }

const router = new Router({
  routes: [
        { path: '/', component: createTemplate }
  ]
})

new Vue({
  data: {
  },
  router,
  components: { App },
  template: '<App/>',
  mounted () {
  }
}).$mount('#app')
