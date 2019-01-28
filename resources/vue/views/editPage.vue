<template lang="html">
    <div>
        <h1>Edit Page</h1>


        <inputField v-for="field in fields"
                        :fieldType="field.type"
                        :fieldId="field.id"
                        :fieldName="field.name"
                        :fieldRequired="field.required"
                        :key="field.id"
                        :content="field.content"></inputField>

        <button @click="savePage">Save Page</button>
    </div>
</template>
<script>
import axios from 'axios'
import inputField from '../components/inputField.vue'
import router from '../../scripts/admin.js'

export default {
    name: '',
    data () {
        return {
            fields: []
        }
    },
    props: [],
    methods: {
        savePage () {
            let d = {
                corpus: "Christi",
                lexus: "nexus"
            }
            axios.patch('/page', d)
        }
    },
    components: {
        inputField
    },
    beforeCreate() {
        axios.get(`/page/?id=${this.$route.params.page_id}`)
            .then((data) => {
                this.fields = data.data.fields
            })
    }
}
</script>
<style lang="css">
</style>