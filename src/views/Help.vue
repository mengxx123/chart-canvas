<template>
    <my-page title="帮助">
        <ui-article>
            <h2>说明</h2>
            <p>一个绘制拓扑图的应用。</p>

            <h2>工具类</h2>
            <ul>
                <li>选择工具：对形状进行选择、拖拽。</li>
                <li>矩形工具：绘制矩形。</li>
                <li>圆形工具：绘制圆形。</li>
                <li>圆形直线：绘制直线。</li>
                <li>连线工具：对两个形状进行连线。</li>
            </ul>


            <h2>快捷键</h2>
            <ul>
                <li>方向键移动选中的元素。</li>
                <li>Ctrl + 方向键调整元素的大小。</li>
                <li>Backspace 键删除选中的元素。</li>
            </ul>
            <p>调整形状大小时，按住 Ctrl 键可以对比例缩放。</p>
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
