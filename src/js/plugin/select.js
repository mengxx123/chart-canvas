/* eslint-disable */
// 矩形插件
let rect = {
    name: 'select',
    onMousedown(box, x, y) {
        var selectedNode = box.getElementByXY(x, y)
        if (selectedNode) {
            if (box.ctrlDown) { // TODO
                selectedNode.onMousedown({x: x, y: y, context: box})
                box.currElement = selectedNode
            } else {
                selectedNode.onMousedown({x: x, y: y, context: box})
                box.currElement = selectedNode
            }

        } else if (box.currElement) {
            box.currElement.cancleSelected()
            box.currElement = null
        }

        

        if (box.currElement) {
            if (box.selectedElements.indexOf(box.currElement) == -1) {
                box.cancleAllSelected()
                box.selectedElements.push(box.currElement)
            }
        } else {
            box.cancleAllSelected()
        }

        for (var i = 0; i < box.selectedElements.length; i++) {
            var node = box.selectedElements[i]
            node.selectedLocation = {x: node.x, y: node.y}
        }
    },
    onMousemove(box, x, y) {
        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)

        //if(box.currElement && !box.currElement.isDragable()) return

        for (var i = box.nodes.length - 1; i >= 0; i--) {
            var node = box.nodes[i]
            if (node.x + node.width < 0 || node.x > box.canvas.width) continue

            if (x > node.x && x < node.x + node.width && y > node.y && y < node.y + node.height) {
                node.onMouseover({x: x, y: y, dx: dx, dy: dy, context: box})
                box.publish('mouseover', {target: node, x: x, y: y, dx: dx, dy: dy, context: box})
            } else {
                if (node.isOnMousOver) {
                    node.onMouseout({x: x, y: y, dx: dx, dy: dy, context: box})
                    box.publish('mouseout', {target: node, x: x, y: y, dx: dx, dy: dy, context: box})
                }
            }
        }

        this.selection = null
        for (var i = box.links.length - 1; i >= 0; i--) {
            var link = box.links[i]
            let p = `M ${link.nodeA.node.x},${link.nodeA.node.y} L ${link.nodeB.node.x},${link.nodeB.node.y}`
            // console.log(p)
            let path = new Path2D(p)
            box.ctx.lineWidth = 4
            if (box.ctx.isPointInPath(path, x, y)) {
                alert('aa')
            }
        }
        if (box.currElement && box.isOnMouseDown && box.currElement.dragable) {
            for (var i = 0; i < box.selectedElements.length; i++) {
                var node = box.selectedElements[i]
                node.onMousedrag({x: x, y: y, dx: dx, dy: dy, context: box})
            }
            box.publish('mousedrag', {target: box.currElement, x: x, y: y})
        } else if (box.isOnMouseDown && box.isRangeSelectable) {
            // 绘制选区
            var startx = x >= box.startDragMouseX ? box.startDragMouseX : x
            var starty = y >= box.startDragMouseY ? box.startDragMouseY : y
            var width = Math.abs(x - box.startDragMouseX)
            var height = Math.abs(y - box.startDragMouseY)
            this.selection = {
                x: startx,
                y: starty,
                width: width,
                height: height
            }

            // 选中选区内的元素
            let isInSelectArea = function (node) {
                let outOfSelectArea = node.x > startx + width || node.x + node.width < startx
                        || node.y > starty + height || node.y + node.height < starty
                return !outOfSelectArea
            }
            box.selectedElements = []
            for (var i = 0; i < box.nodes.length; i++) {
                var node = box.nodes[i]
                if (isInSelectArea(node)) {
                    node.onMouseselected({x: x, y: y, dx: dx, dy: dy, context: box})
                    box.selectedElements.push(node)
                } else {
                    node.cancleSelected()
                }
            }
        }
    },
    onMouseup(box, x, y) {
        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)
        
        if (box.currElement) {
            box.currElement.onMouseup({x: x, y: y, context: box, dx: dx, dy: dy})
        }
    },
    draw(box) {
        if (this.selection) {
            box.ctx.beginPath()
            box.ctx.lineWidth = 1
            box.ctx.strokeStyle = '#999'
            box.ctx.setLineDash([])
            box.ctx.fillStyle = 'rgba(168,202,236,0.5)'
            box.ctx.rect(this.selection.x, this.selection.y, this.selection.width, this.selection.height)
            box.ctx.closePath()
            box.ctx.fill()
            box.ctx.stroke()
        }
    }
}

export default rect
