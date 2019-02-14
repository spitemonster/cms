<template lang="html">
    <div>
      <h1>Dashboard</h1>
      <h3>Welcome {{ user.firstName }}</h3>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data () {
            return {
                user: {}
            }
        },
        props: [],
        methods: {
        },
        created() {
            axios.get('/user')
                .then((user) => {
                    this.user = user.data
                })
                .catch((err) => {
                    console.log('uh oh')
                })
        }
    }
</script>
<style lang="css">
</style>