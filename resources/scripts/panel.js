import Vue from 'Vue'
import App from '../vue/App.vue'
import Sortable from 'vue-sortable'

Vue.use(Sortable)

new Vue({
  el: '#app',
  data: {
  },
  components: { App },
  template: '<App/>',
  mounted () {
    console.log('test')
  }
})
