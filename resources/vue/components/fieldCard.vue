<template>
    <fieldset class="field-card">
          <input type="text" v-model="FieldName" placeholder="Enter Field Name" class="field-card__name" />
          <div class="field-card__meta">
              <span>Type: {{ field.type }}</span>
              <span>ID: {{ field.id }}</span>
          </div>
    </fieldset>
</template>
<script>
    export default {
      name: 'inputField',
      data () {
        return {
          FieldName: ''
        }
      },
      props: ['field']
    }
</script>
<style lang="scss">
</style>