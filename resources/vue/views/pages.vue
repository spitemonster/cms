<template lang="html">
    <div>
        <h1>View Pages</h1>
        <h3 v-for="page, k in pages">{{ page.name }} <button @click="deletePage(k)">Delete Page</button></h3>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data () {
            return {
                pages: {}
            }
        },
        props: [],
        methods: {
            deletePage(pageId) {
                axios.delete(`/page/${pageId}`)
                    .then((res) => {
                        console.log(res)
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