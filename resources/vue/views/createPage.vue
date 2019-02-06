<template lang="html">
    <div>
        <h1>Create Page</h1>
        <input type="text" id="pageName">
        <input type="text" id="pageUrl" @input="filterInput" @change="testPageUrl" pattern="[-/_a-zA-Z0-9]+" value="/">
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
                fields: [],
                selectedTemplate: {}
            }
        },
        props: [],
        methods: {
            selectTemplate () {
                let sel = document.querySelector('#template').value

                if (sel.value !== '') {
                    axios.get(`/template?id=${sel}`)
                        .then((data) => {
                            this.fields = data.data.fields
                            this.selectedTemplate = data.data
                        })
                }
            },
            filterInput(e) {
                e.target.value = e.target.value.replace(/[\s~!@#$%^&*()+={}|\\:;"'<>,.?]+/g, '')
            },
            testPageUrl (e) {
                let v = e.target.value
                let vs = v.split('')
                if (vs[0] !== '/') {
                    e.target.value = `/${v}`
                }

                axios.get(`v`)
                    .then((res) => {
                        console.log(res)
                    })
                    .catch((err) => {
                        console.log('not in use')
                    })
            },
            createPage () {
                let url = document.querySelector('#pageUrl')
                let headers = { 'Content-Type': 'application/json' }


                let pageData = {}

                pageData.name = document.querySelector('#pageName').value
                pageData.url = url.value
                pageData.templateUrl = this.selectedTemplate.templateUrl
                pageData.templateId = this.selectedTemplate.id
                pageData.fields = this.fields

                if (!url.checkValidity) {
                    url.classList.add('invalid')
                    return
                }

                axios.post('/page', pageData, headers)
                .then((res) => {
                    if (res.status === 200) {
                        this.$router.push({ name: 'viewPages' })
                    }
                }).catch((err) => {

                })
            }
        },
        components: {
            inputField
        },
        beforeCreate () {
            axios.get('/template')
          .then((res) => {
              this.templates = res.data
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