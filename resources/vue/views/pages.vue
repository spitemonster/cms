<template lang="html">
    <div>
        <h1>View Pages</h1>
        <h3 v-for="page, k in pages">{{ page.name }}</h3>
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