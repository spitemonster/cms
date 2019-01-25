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

// import components
import fieldCard from '../vue/components/fieldCard.vue'

const Bus = new Vue()

export default Bus

Vue.use(Sortable)
Vue.use(Router)

const test = { template: '<div>foo</div>' }

const router = new Router({
    mode: "history",
    routes: [
        { path: '/admin', component: dashboard },
        { path: '/admin/create/template', component: createTemplate },
        { path: '/admin/create/page', component: createPage },
        { path: '/admin/view/pages', component: viewPages },
        { path: '/admin/view/templates', component: viewTemplates }
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
