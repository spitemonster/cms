<template lang="html">
    <div class="growler" :class="mode">
        <p>{{ message }}</p>
    </div>
</template>
<script>
    export default {
        name: '',
        data () {
            return {

            }
        },
        props: [
            'message',
            'mode'
        ],
        methods: {

        }
    }
</script>
<style lang="scss">
    .growler {
        position: absolute;
        bottom: 2rem;
        right: -100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        max-width: 500px;
        padding: 1rem 2rem;
        transition: all 250ms linear;

        &.show {
            right: 2rem;
        }

        &.success {
            color: green;

            &::before {
                content: "✓";
                padding: 0 2rem 0 0;
                font-size: 3rem;
            }
        }

        &.alert {
            color: orange;

            &::before {
                content: "!";
                padding: 0 2rem 0 0;
                font-size: 3rem;
            }
        }

        &.error {
            color: red;

            &::before {
                content: "X";
                padding: 0 2rem 0 0;
                font-size: 3rem;
            }
        }
    }
</style>