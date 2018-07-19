/* eslint-disable */
// 矩形插件
let rect = {
    name: 'rect',
    onMousedown(e, box, x, y) {
        this.isMouseDown = true,
        this.node = null
    },
    onMousemove(e, box, x, y) {
        if (this.isMouseDown) {
            box.ctx.fillStyle = box.defaultStyle.fill
            let minX = Math.min(x, box.startDragMouseX)
            let minY = Math.min(y, box.startDragMouseY)
            this.node = {
                x: Math.min(x, box.startDragMouseX),
                y: Math.min(y, box.startDragMouseY),
                width: Math.abs(x - box.startDragMouseX),
                height: Math.abs(y - box.startDragMouseY)
            }
            box.setDefaultStyle()
            box.ctx.beginPath()
            box.ctx.rect(minX, minY, 
                Math.abs(x - box.startDragMouseX), Math.abs(y - box.startDragMouseY))
            box.ctx.fill()    
            box.ctx.stroke()    
        }
    },
    onMouseup(e, box, x, y) {
        this.isMouseDown = false
        let minX = Math.min(x, box.startDragMouseX)
        let minY = Math.min(y, box.startDragMouseY)
        let width = Math.abs(x - box.startDragMouseX)
        let height = Math.abs(y - box.startDragMouseY)

        this.node = null

        var node = new Topo.Rect()
        node.setSize(width, height)
        node.setLocation(minX, minY)
        box.setDefaultStyleToNode(node)
        box.add(node)

        // box.mode = 'common'
    },
    draw(box) {
        if (this.node) {
            box.setDefaultStyle()
            box.ctx.beginPath()
            box.ctx.rect(this.node.x, this.node.y, this.node.width, this.node.height)
            box.ctx.fill()    
            box.ctx.stroke()    
        }
    }
}

export default rect
