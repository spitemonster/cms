<template>
    <fieldset class="field-card">
          <input type="text" v-model="fieldName" placeholder="Enter Field Name" class="field-card__name" @change="nameField"/>
          <div class="field-card__meta">
              <span>Type: {{ field.type }}</span>
              <span>ID: {{ field.id }}</span>
          </div>
          <div>
            <label for="required">Required?</label>
            <input type="checkbox" name="required" v-model="fieldRequired" @click="requireField">
          </div>
          <span @click="deleteField">Delete Field</span>
    </fieldset>
</template>
<script>
    import Bus from '../../scripts/admin.js'

    export default {
        name: 'inputField',
        data () {
            return {
                fieldName: this.field.name ? this.field.name : '',
                fieldId: this.field.id,
                fieldRequired: this.field.required ? this.field.required : false,
                fieldType: this.field.text
            }
        },
        props: ['field'],
        methods: {
            deleteField () {
                Bus.$emit('delete', this.fieldId)
            },
            requireField () {
                Bus.$emit('requireField', { id: this.fieldId, required: this.fieldRequired })
            },
            nameField () {
                Bus.$emit('nameField', { id: this.fieldId, name: this.fieldName })
            }
        }
    }
</script>
<style lang="scss">
</style>