<template lang="html">
    <main class="dashboard">
      <nav class="dashboard__nav">
          <ul>
              <router-link tag="li" to="/admin/">
                <a>Dashboard</a>
              </router-link>
              <router-link tag="li" to="/admin/create/template">
                <a>Create New Template</a>
              </router-link>
              <router-link tag="li" to="/admin/create/page">
                <a>Create New Page</a>
              </router-link>
              <router-link tag="li" to="/admin/view/templates">
                <a>View Templates</a>
              </router-link>
              <router-link tag="li" to="/admin/view/pages">
                <a>View Pages</a>
              </router-link>
          </ul>
      </nav>
      <div class="dashboard__body l-auto">
        <router-view></router-view>
      </div>
    </main>
</template>
<script>
    import fieldCard from './components/fieldCard.vue'
    import createTemplate from './views/createTemplate.vue'
    import createPage from './views/createPage.vue'
    import draggable from 'vuedraggable'
    import Bus from '../scripts/admin.js'
    import router from '../scripts/admin.js'

    export default {
        name: 'App',
        data () {
            return {
                fields: []
            }
        },
        methods: {
        },
        components: {
            fieldCard,
            createTemplate,
            createPage,
            draggable,
            router
        },
        mounted () {
        },
        updated () {
        }
    }
</script>
<style lang="css">

</style>