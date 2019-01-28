import Vue from 'Vue'
import Router from 'vue-router'
import App from '../vue/App.vue'
import Sortable from 'vue-sortable'

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
        { path: '/admin', component: dashboard },
        { path: '/admin/create/template', component: createTemplate },
        { path: '/admin/create/page', component: createPage },
        { path: '/admin/view/pages', component: viewPages },
        { path: '/admin/view/templates', component: viewTemplates },
        { path: '/admin/page/:page_id/edit', component: editPage }
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
