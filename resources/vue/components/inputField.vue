<template lang="html">
    <div>
        <label :for="fieldName">{{ fieldName }}</label>
        <template v-if="fieldType === 'text'">
            <input type="text" :name="fieldName" :data-fieldId="fieldId" :required="fieldRequired ? true : false" :id="fieldName" class="inputField" @change="fieldContent($event)" :value="content">
        </template>
        <template v-else-if="fieldType === 'textarea'">
            <textarea :name="fieldName" :data-fieldId="fieldId" :required="fieldRequired ? true : false" :id="fieldName" class="inputField" @change="fieldContent($event)">{{ content }}</textarea>
        </template>
        <template v-else-if="fieldType === 'wysiwyg'">
            <form action="" method="get" accept-charset="utf-8">
                <input type="hidden" name="content" :value="content" :name="fieldName" :data-fieldId="fieldId" :required="fieldRequired ? true : false" id="x" class="inputField">
                <trix-editor input="x"></trix-editor>
            </form>
        </template>
    </div>
</template>
<script>
    import Bus from '../../scripts/admin.js'
    import Trix from 'trix'

    export default {
        data () {
            return {

            }
        },
        props: ['fieldType', 'fieldName', 'fieldId', 'fieldRequired', 'content'],
        methods: {
            fieldContent (e) {
                Bus.$emit('fieldFill', e.target)
            },
            test () {
                console.log('quill changed')
            }
        },
        mounted () {
            Trix.config.blockAttributes.default.tagName = "p"

            document.addEventListener('trix-change', () => {
                let content = document.querySelector('#x')

                Bus.$emit('fieldFill', content)
            })
        }
    }
</script>
<style lang="css">
</style>