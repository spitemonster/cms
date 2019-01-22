<template lang="html">
    <main>
      <draggable element="form" :list="fields">
          <template v-for="field in fields">
            <fieldCard :field="field"></fieldCard>
          </template>
      </draggable>

      <select name="field-type" id="fieldSelector">
          <option value="text">Text</option>
          <option value="textarea">Text Area</option>
      </select>

      <button @click="addField">Add Field</button>
    </main>
</template>
<script>
    import fieldCard from './components/fieldCard.vue'
    import draggable from 'vuedraggable'

    export default {
      name: 'App',
      data () {
        return {
          fields: [{id: 0, type: 'text'}, {id: 1, type: 'textarea'}, {id: 2, type: 'text'}]
        }
      },
      methods: {
        addField () {
          let sel = document.getElementById('fieldSelector')

          this.fields.push({id: this.fields.length, type: sel.value})
        }
      },
      components: {
        fieldCard,
        draggable
      },
      updated () {
        this.fields.forEach((field) => {
          console.log(field.id)
        })
      }
    }
</script>
<style lang="css">

</style>