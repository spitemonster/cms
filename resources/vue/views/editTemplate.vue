<template lang="html">
    <div>
        <h2>Edit Template</h2>
        <input type="text" name="templateName" placeholder="Template Name" id="template-name" style="display: block;" v-model="templateName">
        <fieldCard v-for="field in fields" :key="field.id" :field="field"></fieldCard>
        <button @click="saveTemplate">Save Template</button>
    </div>
</template>
<script>
    import axios from 'axios'
    import fieldCard from '../components/fieldCard.vue'
    import Bus from '../../scripts/admin.js'

    export default {
        data () {
            return {
                templateName :'',
                fields: []
            }
        },
        props: [],
        methods: {
            saveTemplate () {
                let templateData = {}
                let headers = { 'Content-Type': 'application/json' }

                templateData.name = this.templateName
                templateData.fields = this.fields

                axios.patch(`/template/${this.$route.params.template_id}`, templateData, headers)
                    .then((res) => {
                        console.log(res)
                    })

            }
        },
        components: {
            fieldCard,
        },
        beforeCreate() {
            axios.get(`/template/${this.$route.params.template_id}`)
                .then((res) => {
                    this.fields = res.data.fields
                    this.templateName = res.data.name
                })
        },
        mounted() {
            Bus.$on('nameField', (f) => {
                this.fields.forEach((field) => {
                    if (f.id === field.id) {
                        field.name = f.name
                    }
                })
            })

            Bus.$on('requireField', (f) => {
                this.fields.forEach((field) => {
                    if (f.id === field.id) {
                        field.required = f.required
                    }
                })
            })
        }
    }
</script>
<style lang="css">
</style>