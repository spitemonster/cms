<template lang="html">
    <div>
        <h1>View Pages</h1>
        <h3 v-for="page, k in pages" :key="k">{{ page.name }} <button @click="deletePage(k)">Delete Page</button> <router-link tag="span" :to="'/admin/page/' + page.id + '/edit'"><a>Edit Page</a></router-link><a :href="page.url" target="_blank" rel="noopener noreferrer">View Page</a></h3>
    </div>
</template>
<script>
    import axios from 'axios'
    import router from '../../scripts/admin.js'
    import Bus from '../../scripts/admin.js'

    export default {
        data () {
            return {
                pages: {}
            }
        },
        props: [],
        methods: {
            deletePage(pageId) {
                this.$delete(this.pages, pageId)

                axios.delete(`/page/${pageId}`)
                    .then((res) => {
                        let growlerData = {
                            mode: 'success',
                            message: 'Page successfully deleted'
                        }
                        Bus.$emit('growl', growlerData)
                    })
            }
        },
        beforeCreate () {
            axios.get('/page')
                .then((res) => {
                    this.pages = res.data
                })
        }
    }
</script>
<style lang="css">
</style>