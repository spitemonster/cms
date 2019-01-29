<template lang="html">
    <div>
        <label :for="fieldName">{{ fieldName }}</label>
        <template v-if="fieldType === 'text'">
            <input type="text" :name="fieldName" :data-fieldId="fieldId" :required="fieldRequired ? true : false" :id="fieldName" class="inputField" @change="fieldContent($event)" :value="content">
        </template>
        <template v-else-if="fieldType === 'textarea'">
            <textarea :name="fieldName" :data-fieldId="fieldId" :required="fieldRequired ? true : false" :id="fieldName" class="inputField" @change="fieldContent($event)">{{ content }}</textarea>
        </template>
    </div>
</template>
<script>
    import Bus from '../../scripts/admin.js'

    export default {
        data () {
            return {

            }
        },
        props: ['fieldType', 'fieldName', 'fieldId', 'fieldRequired', 'content'],
        methods: {
            fieldContent (e) {
                Bus.$emit('fieldFill', e.target)
            }
        }
    }
</script>
<style lang="css">
</style>