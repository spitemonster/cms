<template lang="html">
  <div>
    <h1>View Templates</h1>
    <h3 v-for="template, k in templates"> {{ template.name }}</h3>
  </div>
</template>
<script>
    import fieldCard from '../components/fieldCard.vue'
    import draggable from 'vuedraggable'
    import Bus from '../../scripts/admin.js'
    import uuidv4 from 'uuid/v4'
    import axios from 'axios'

    export default {
        data () {
            return {
                templates: {}
            }
        },
        props: [],
        methods: {

        },
        beforeCreate () {
            axios.get('/template')
          .then((res) => {
              this.templates = res.data.templates
          })
        }
    }
</script>
<style lang="css">
</style>