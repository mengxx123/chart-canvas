/* eslint-disable */
// 圆形插件
export default {
    name: 'round',
    onMousemove(e, box, x, y) {
        if (box.isOnMouseDown) {
            let minX = Math.min(x, box.startDragMouseX)
            let minY = Math.min(y, box.startDragMouseY)
            let radius = Math.sqrt(Math.pow(x - box.startDragMouseX, 2) + Math.pow(y - box.startDragMouseY, 2))
            
            this.node = {
                x: box.startDragMouseX,
                y: box.startDragMouseY,
                r: radius
            }
        }
    },
    onMouseup(e, box, x, y) {
        this.node = null
        let radius = Math.sqrt(Math.pow(x - box.startDragMouseX, 2) + Math.pow(y - box.startDragMouseY, 2))
        var node = new Topo.Circle()
        node.r = radius
        node.setLocation(box.startDragMouseX - radius, box.startDragMouseY - radius)
        box.setDefaultStyleToNode(node)
        box.add(node)
        // box.mode = 'common'
    },
    draw(box) {
        if (this.node) {
            box.setDefaultStyle()
            box.ctx.beginPath()
            box.ctx.arc(this.node.x, this.node.y, this.node.r, 0, 2 * Math.PI)
            box.ctx.fill()
            box.ctx.stroke()
        }
    }
}
