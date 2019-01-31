import Vue from 'Vue'
import Router from 'vue-router'
import App from '../vue/App.vue'
import Sortable from 'vue-sortable'
import axios from 'axios'

// import views
import dashboard from '../vue/views/dashboard.vue'
import createTemplate from '../vue/views/createTemplate.vue'
import createPage from '../vue/views/createPage.vue'
import viewPages from '../vue/views/pages.vue'
import viewTemplates from '../vue/views/templates.vue'
import editPage from '../vue/views/editPage.vue'

// import components

const Bus = new Vue()

export default Bus

Vue.use(Sortable)
Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', name: 'admin', component: dashboard },
        { path: '/create/template', name: 'createTemplate', component: createTemplate },
        { path: '/create/page', name: 'createPage', component: createPage },
        { path: '/view/pages', name: 'viewPages', component: viewPages },
        { path: '/view/templates', name: 'viewTemplates', component: viewTemplates },
        { path: '/page/:page_id/edit', name: 'editPages', component: editPage }
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