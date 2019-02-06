<template lang="html">
    <div>
        <h1>View Pages</h1>
        <h3 v-for="page, k in pages" :key="k">{{ page.name }} <button @click="deletePage(k)">Delete Page</button> <router-link tag="span" :to="'/admin/page/' + page.id + '/edit'"><a>Edit Page</a></router-link> </h3>
    </div>
</template>
<script>
    import axios from 'axios'
    import router from '../../scripts/admin.js'

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
                        console.log(this.pages)
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