<template>
    <my-page title="帮助">
        <ui-article>
            <h2>说明</h2>
            <p>一个绘制拓扑图的应用。</p>

            <h2>快捷键</h2>
            <ul>
                <li>方向键移动选中的元素。</li>
                <li>Ctrl + 方向键调整元素的大小。</li>
                <li>Backspace 键删除选中的元素。</li>
            </ul>
            <p>鼠标可以多选，对元素进行批量操作。</p>
            <p>支持的批量操作：批量删除、批量移动。</p>
            <p>支持导出的格式有：png。</p>
        </ui-article>
    </my-page>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>
