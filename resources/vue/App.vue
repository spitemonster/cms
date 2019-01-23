<template lang="html">
    <main>
      <router-view></router-view>
    </main>
</template>
<script>
    import fieldCard from './components/fieldCard.vue'
    import createTemplate from './components/createTemplate.vue'
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