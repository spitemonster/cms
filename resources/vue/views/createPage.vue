<template lang="html">
    <div>
        <h1>Create Page</h1>
        <input type="text" id="pageName" @change="testPageName">
        <select id="template" @change="selectTemplate">
            <option value="">Choose Template</option>
            <option v-for="template, k in templates" :value="k">{{ template.name }}</option>
        </select>

        <inputField v-for="field in fields"
                    :fieldType="field.type"
                    :fieldId="field.id"
                    :fieldName="field.name"
                    :fieldRequired="field.required"
                    :key="field.id"></inputField>

        <button @click="createPage">Create Page</button>
    </div>
</template>
<script>
    import axios from 'axios'
    import inputField from '../components/inputField.vue'
    import Bus from '../../scripts/admin.js'

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
                this.fields.forEach((field) => {
                    console.log(field.id)
                })
            })
                }
            },
            testPageName () {

            },
            createPage () {
                let headers = { 'Content-Type': 'application/json' }

                let pageData = {}
                pageData.name = document.querySelector('#pageName').value
                pageData.template = document.querySelector('#template').value
                pageData.fields = this.fields

                console.log(pageData)

                axios.post('/page', pageData, headers)
                .then((res) => {
                    console.log('res')
                })
            }
        },
        components: {
            inputField
        },
        beforeCreate () {
            axios.get('/templates')
          .then((res) => {
              this.templates = res.data.templates
          })
        },
        mounted () {
            Bus.$on('fieldFill', (field) => {
                let targetField = field.dataset.fieldid

                this.fields.forEach((f) => {
                    if (f.id == targetField) {
                        f.content = field.value
                    }
                })
            })
        }
    }
</script>
<style lang="css">
</style>