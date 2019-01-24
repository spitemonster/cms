<template lang="html">
    <div>
        <h1>Create Page</h1>
        <select id="template" @change="selectTemplate">
            <option value="">Choose Template</option>
            <option v-for="template, k in templates" :value="k">{{ template.name }}</option>
        </select>
        <template v-for="field in fields">
            {{ field.type }}
        </template>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
      data () {
        return {
          templates: {},
          fields: []
        }
      },
      props: [],
      methods: {
        selectTemplate () {
          let sel = document.querySelector('#template')
          if (sel.value !== '') {
            axios.get(`/templates/${sel.value}`)
            .then((data) => {
              this.fields = data.data.fields
            })
          }
        }
      },
      beforeCreate () {
        axios.get('/templates')
          .then((res) => {
            this.templates = res.data.templates
          })
      }
    }
</script>
<style lang="css">
</style>