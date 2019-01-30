<template lang="html">
    <div>
        <h1>Edit Page</h1>
        <input type="text" id="pageName" :value="name">
        <input type="text" id="pageUrl" :value="url">

        <inputField v-for="field in fields"
                        :fieldType="field.type"
                        :fieldId="field.id"
                        :fieldName="field.name"
                        :fieldRequired="field.required"
                        :key="field.id"
                        :content="field.content"></inputField>

        <select name="revisions" @change="loadRevision">
            <option v-for="revision in revisions" :value="revision.id">{{ revision.name }} - {{ revision.createdAt }}</option>
        </select>

        <button @click="savePage">Save Page</button>
    </div>
</template>
<script>
import axios from 'axios'
import inputField from '../components/inputField.vue'
import Bus from '../../scripts/admin.js'
import router from '../../scripts/admin.js'

export default {
    name: '',
    data () {
        return {
            name: '',
            url: '',
            fields: [],
            revisions: []
        }
    },
    props: [],
    methods: {
        loadRevision (e) {
            axios.get(`/page/${this.$route.params.page_id}/revision/${e.target.value}`)
            .then((data) => {
                this.fields = data.data.fields
                this.name = data.data.name
                this.url = data.data.url
            })
        },
        savePage () {
            let headers = { 'Content-Type': 'application/json' }

            let pageData = {}
            pageData.name = document.querySelector('#pageName').value
            pageData.url = document.querySelector('#pageUrl').value
            pageData.fields = this.fields

            axios.patch(`/page/${this.$route.params.page_id}`, pageData, headers)
            .then((res) => {
                this.$router.push({ name: 'admin' })
            })
        }
    },
    components: {
        inputField
    },
    beforeCreate() {
        axios.get(`/page/${this.$route.params.page_id}`)
            .then((data) => {
                this.fields = data.data.fields
                this.name = data.data.name
                this.url = data.data.url
                this.revisions = data.data.revisions
            })
    },
    mounted() {
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