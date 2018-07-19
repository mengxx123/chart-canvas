<template>
    <div class="menu-item">
        <ui-flat-button class="btn" :label="title" ref="button" @click="toggle"/>
        <div class="menu">
            <slot name="menu"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                open: false,
                trigger: null
            }
        },
        props: {
            title: {
                default: ''
            }
        },
        mounted() {
        },
        methods: {
            toggle () {
                this.open = !this.open
            },
            handleClose (e) {
                this.open = false
            }
        }
    }
</script>

<style lang="scss" scoped>
.btn {
    margin-top: 6px;
}
.menu-item {
    position: relative;
    height: 48px;
    &:hover {
        .menu {
            display: block;
        }
    }
}
.menu {
    display: none;
    position: absolute;
    top: 48px;
    left: 0;
    width: 160px !important;
    z-index: 100000;
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    overflow: hidden;
}
</style>
