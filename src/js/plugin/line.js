/* eslint-disable */
// 直线插件
export default {
    name: 'line',
    onMousemove(box, x, y) {
        if (box.isOnMouseDown) {
            this.node = {
                x: box.startDragMouseX,
                y: box.startDragMouseY,
                x2: x,
                y2: y
            }
        }
    },
    onMouseup(box, x, y) {
        this.node = null
        let minX = Math.min(x, box.startDragMouseX)
        let minY = Math.min(y, box.startDragMouseY)
        let width = Math.abs(x - box.startDragMouseX)
        let height = Math.abs(y - box.startDragMouseY)
        
        let line = new Topo.Line()
        line.x = box.startDragMouseX
        line.y = box.startDragMouseY
        line.x2 = x
        line.y2 = y
        box.setDefaultStyleToNode(line)
        box.add(line)
        // box.mode = 'common'
    },
    draw(box) {
        if (this.node) {
            console.log('画矩形')
            box.setDefaultStyle()

            box.setDefaultStyle()
            box.ctx.beginPath()
            box.ctx.moveTo(this.node.x, this.node.y)
            box.ctx.lineTo(this.node.x2, this.node.y2)
            box.ctx.stroke()
        }
    }
}
