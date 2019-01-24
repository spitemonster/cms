<template lang="html">
    <main>
      <input type="text" name="templateName" placeholder="Template Name" id="template-name" style="display: block;">

      <select name="field-type" id="fieldSelector">
          <option value="text">Text</option>
          <option value="textarea">Text Area</option>
      </select>

      <button @click="addField">Add Field</button>
      <draggable element="form" :list="fields" id="test">
            <fieldCard :field="field" v-for="field in fields" :key="field.id"></fieldCard>
      </draggable>
      <button @click="saveTemplate">Save Template</button>
    </main>
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
          fields: []
        }
      },
      methods: {
        addField () {
          let sel = document.getElementById('fieldSelector')

          this.fields.push({id: this.generateId(), name: '', type: sel.value, required: false})
        },
        removeField (targetId) {
          this.fields = this.fields.filter((field) => {
            return field.id !== targetId
          })
        },
        generateId () {
          return uuidv4()
        },
        saveTemplate () {
          let templateName = document.querySelector('#template-name').value

          let headers = { 'Content-Type': 'application/json' }

          let template = {
            name: templateName,
            id: this.generateId(),
            fields: this.fields
          }

          // let data = JSON.stringify(template)

          axios.post('/create/template', template, headers)
            .then((res) => {
              console.log(res)
            })

          console.log(template)
        }
      },
      components: {
        fieldCard,
        draggable
      },
      mounted () {
        Bus.$on('delete', (fieldId) => {
          this.removeField(fieldId)
        })

        Bus.$on('requireField', (field) => {
          this.fields.filter((f) => {
            if (f.id === field.id) {
              f.required = !f.required
            }
          })
        })

        Bus.$on('nameField', (field) => {
          this.fields.filter((f) => {
            if (f.id === field.id) {
              f.name = field.name
            }
          })
        })
      },
      updated () {
      }
    }
</script>
<style lang="css">

</style>