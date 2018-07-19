/* eslint-disable */
// 矩形插件

function distance(x, y, x2, y2) {
    return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2))
}

let rect = {
    name: 'select',
    onMousedown(e, box, x, y) {
        var selectedNode = box.getElementByXY(x, y)

        // resize mode
        if (box._resizePts && box._resizePts.length) {
            for (let pt of box._resizePts) {
                if (distance(x, y, pt.x, pt.y) < 10) {
                    this.resizeDown = true
                    this.resizeOriginX = box._resizeNode.x
                    this.resizeOriginY = box._resizeNode.y
                    this.resizeOriginWidth = box._resizeNode.getWidth()
                    this.resizeOriginHeight = box._resizeNode.getHeight()
                    this.resizeDownX = x
                    this.resizeDownY = y
                    this.resizeType = pt.name
                    return
                }
            }   
        }

        if (selectedNode) {
            if (e.ctrlKey) { // TODO
                box.currElement = selectedNode
                if (selectedNode.selected) {
                    selectedNode.cancleSelected()
                    for (let node of box.selectedElements) {
                        if (node.id === selectedNode.id) {
                            box.selectedElements.splice(i, 1)
                        }
                    }
                    // box.selectedElements.push(selectedNode)
                } else {
                    selectedNode.selected = true
                    box.selectedElements.push(selectedNode)
                }
                selectedNode.onMousedown({x: x, y: y, context: box})
            } else {
                if (box.selectedElements.length < 2) {
                    box.cancleAllSelected()
                    selectedNode.selected = true
                    selectedNode.onMousedown({x: x, y: y, context: box})
                    box.currElement = selectedNode
                    box.selectedElements = []
                    box.selectedElements.push(selectedNode)
                }
            }
            this.elemDown = true
        } else {
            this.blankDown = true
            if (box.selectedElements.length) {
                // box.currElement.cancleSelected()
                // box.currElement = null
                box.cancleAllSelected()
                box.selectedElements = []
            }
        }

        // if (box.currElement) {
        //     if (box.selectedElements.indexOf(box.currElement) == -1) {
        //         box.cancleAllSelected()
        //         // box.selectedElements.push(box.currElement)
        //     }
        // } else {
        //     box.cancleAllSelected()
        // }

        for (var i = 0; i < box.selectedElements.length; i++) {
            var node = box.selectedElements[i]
            node.selectedLocation = {x: node.x, y: node.y}
        }
    },
    onMousemove(e, box, x, y) {
        // resize mode
        if (this.resizeDown) {
            if (e.ctrlKey) {
                switch (this.resizeType) {
                    case 'right':
                        let newWidth = this.resizeOriginWidth + x - this.resizeDownX
                        let newHeight = newWidth * this.resizeOriginHeight /this.resizeOriginWidth
                        box._resizeNode.setWidth(newWidth)
                        box._resizeNode.setHeight(newHeight)
                        box._resizeNode.y = this.resizeOriginY + (this.resizeOriginHeight - newHeight) / 2
                        break
                    case 'bottom':
                        {
                            let newHeight = this.resizeOriginHeight + y - this.resizeDownY
                            let newWidth = newHeight * this.resizeOriginWidth /this.resizeOriginHeight
                            box._resizeNode.setHeight(newHeight)
                            box._resizeNode.setWidth(newWidth)
                            box._resizeNode.x = this.resizeOriginX + (this.resizeOriginWidth - newWidth) / 2
                        }
                        break
                    case 'right_bottom':
                        {
                            let newWidth = this.resizeOriginWidth + x - this.resizeDownX
                            let newHeight = this.resizeOriginHeight + y - this.resizeDownY
                            let scaleWidth = newWidth / this.resizeOriginWidth
                            let scaleHeight = newHeight / this.resizeOriginHeight
                            if (scaleWidth < scaleHeight) {
                                newHeight = newWidth * this.resizeOriginHeight /this.resizeOriginWidth
                            } else {
                                newWidth = newHeight * this.resizeOriginWidth /this.resizeOriginHeight
                            }
                            box._resizeNode.setHeight(newHeight)
                            box._resizeNode.setWidth(newWidth)
                        }
                        break
                    case 'right_top':
                        {
                            let newWidth = this.resizeOriginWidth + x - this.resizeDownX
                            let newHeight = this.resizeOriginHeight + this.resizeDownY - y
                            let scaleWidth = newWidth / this.resizeOriginWidth
                            let scaleHeight = newHeight / this.resizeOriginHeight
                            if (scaleWidth < scaleHeight) {
                                newHeight = newWidth * this.resizeOriginHeight /this.resizeOriginWidth
                            } else {
                                newWidth = newHeight * this.resizeOriginWidth /this.resizeOriginHeight
                            }
                            box._resizeNode.y = this.resizeOriginY + this.resizeOriginHeight - newHeight
                            box._resizeNode.setWidth(newWidth)
                            box._resizeNode.setHeight(newHeight)
                        }
                        break
                    case 'left':
                        {
                            let newWidth = this.resizeOriginWidth + this.resizeDownX - x
                            let newHeight = newWidth * this.resizeOriginHeight /this.resizeOriginWidth
                            box._resizeNode.x = x
                            box._resizeNode.setWidth(newWidth)
                            box._resizeNode.setHeight(newHeight)
                            box._resizeNode.y = this.resizeOriginY + (this.resizeOriginHeight - newHeight) / 2
                        }
                        break
                    case 'top':
                        {
                            let newHeight = this.resizeOriginHeight + this.resizeDownY - y
                            let newWidth = newHeight * this.resizeOriginWidth /this.resizeOriginHeight
                            box._resizeNode.y = y
                            box._resizeNode.setHeight(newHeight)
                            box._resizeNode.setWidth(newWidth)
                            box._resizeNode.x = this.resizeOriginX + (this.resizeOriginWidth - newWidth) / 2
                        }
                        break
                    case 'left_top':
                        {
                            let newWidth = this.resizeOriginWidth + this.resizeDownX - x
                            let newHeight = this.resizeOriginHeight + this.resizeDownY - y
                            let scaleWidth = newWidth / this.resizeOriginWidth
                            let scaleHeight = newHeight / this.resizeOriginHeight
                            if (scaleWidth < scaleHeight) {
                                newHeight = newWidth * this.resizeOriginHeight /this.resizeOriginWidth
                            } else {
                                newWidth = newHeight * this.resizeOriginWidth /this.resizeOriginHeight
                            }
                            box._resizeNode.x = this.resizeOriginX + this.resizeOriginWidth - newWidth
                            box._resizeNode.y = this.resizeOriginY + this.resizeOriginHeight - newHeight
                            box._resizeNode.setWidth(newWidth)
                            box._resizeNode.setHeight(newHeight)
                        }
                        break
                    case 'left_bottom':
                        {
                            let newWidth = this.resizeOriginWidth + this.resizeDownX - x
                            let newHeight = this.resizeOriginHeight + y - this.resizeDownY
                            let scaleWidth = newWidth / this.resizeOriginWidth
                            let scaleHeight = newHeight / this.resizeOriginHeight
                            if (scaleWidth < scaleHeight) {
                                newHeight = newWidth * this.resizeOriginHeight /this.resizeOriginWidth
                            } else {
                                newWidth = newHeight * this.resizeOriginWidth /this.resizeOriginHeight
                            }
                            // box._resizeNode.y = this.resizeOriginY - this.resizeOriginHeight + newHeight
                            box._resizeNode.x = this.resizeOriginX + this.resizeOriginWidth - newWidth
                            box._resizeNode.setWidth(newWidth)
                            box._resizeNode.setHeight(newHeight)
                        }
                        break
                }
            } else {
                if (this.resizeType.includes('right')) {
                    box._resizeNode.setWidth(this.resizeOriginWidth + x - this.resizeDownX)
                }
                if (this.resizeType.includes('bottom')) {
                    box._resizeNode.setHeight(this.resizeOriginHeight + y - this.resizeDownY)
                }
                if (this.resizeType.includes('left')) {
                    box._resizeNode.x = x
                    box._resizeNode.setWidth(this.resizeOriginWidth + this.resizeDownX - x)
                }
                if (this.resizeType.includes('top')) {
                    box._resizeNode.y = y
                    box._resizeNode.setHeight(this.resizeOriginHeight + this.resizeDownY - y)
                }
            }
            return
        }
        // selection mode
        this.selection = null
        if (this.blankDown && box.isOnMouseDown && box.isRangeSelectable) {
            this.isSelection = true
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
                if (!node.visible || node.lock) {
                    continue
                }
                if (isInSelectArea(node)) {
                    node.onMouseselected({x: x, y: y, dx: dx, dy: dy, context: box})
                    box.selectedElements.push(node)
                } else {
                    node.cancleSelected()
                }
            }
            return
        }
        // drag mode
        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)
        if (this.elemDown && box.isOnMouseDown) {
            this.isDrag = true
            for (var i = 0; i < box.selectedElements.length; i++) {
                var node = box.selectedElements[i]
                if (node.dragable) {
                    node.onMousedrag({x: x, y: y, dx: dx, dy: dy, context: box})
                }
            }
            box.publish('mousedrag', {target: box.currElement, x: x, y: y})
        }

        let cursor = 'default'
        if (box._resizePts && box._resizePts.length) {
            for (let pt of box._resizePts) {
                if (distance(x, y, pt.x, pt.y) < 10) {
                    cursor = pt.cursor
                    break
                }
            }   
        }

        //if(box.currElement && !box.currElement.isDragable()) return
        

        for (var i = box.nodes.length - 1; i >= 0; i--) {
            var node = box.nodes[i]
            if (!node.visible || node.lock) {
                continue
            }
            if (node.x + node.width < 0 || node.x > box.canvas.width) continue

            if (node.isPointInPath(x, y)) {
                node.onMouseover({x: x, y: y, dx: dx, dy: dy, context: box})
                box.publish('mouseover', {target: node, x: x, y: y, dx: dx, dy: dy, context: box})
                cursor = 'pointer'
            } else {
                if (node.isOnMousOver) {
                    node.onMouseout({x: x, y: y, dx: dx, dy: dy, context: box})
                    box.publish('mouseout', {target: node, x: x, y: y, dx: dx, dy: dy, context: box})
                    cursor = 'default'
                }
            }
        }

        if (cursor !== box.cursor) {
            box.cursor = cursor
            box.publish('cursor', {target: node, cursor: cursor})
        }

        
        for (var i = box.links.length - 1; i >= 0; i--) {
            var link = box.links[i]
            let p = `M ${link.nodeA.node.x},${link.nodeA.node.y} L ${link.nodeB.node.x},${link.nodeB.node.y}`
            let path = new Path2D(p)
            box.ctx.lineWidth = 4
            if (box.ctx.isPointInPath(path, x, y)) {
                alert('aa')
            }
        }
        
    },
    onMouseup(e, box, x, y) {
        this.elemDown = false
        this.blankDown = false
        if (this.isDrag) {
            this.isDrag = false
            return
        }
        if (this.isSelection) {
            this.isSelection = false
            return
        }
        if (this.resizeDown) {
            this.resizeDown = false
            return
        }

        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)
        
        var selectedNode = box.getElementByXY(x, y)

        if (selectedNode) {
            if (e.ctrlKey) { // TODO
                // box.currElement = selectedNode
                // console.log(selectedNode.selected)
                // if (selectedNode.selected) {
                //     selectedNode.cancleSelected()
                //     console.log('找', selectedNode.id)
                //     for (let node of box.selectedElements) {
                //         if (node.id === selectedNode.id) {
                //             console.log('找到了')
                //             box.selectedElements.splice(i, 1)
                //         }
                //     }
                // } else {
                //     selectedNode.selected = true
                //     console.log('插入1')
                //     box.selectedElements.push(selectedNode)
                // }
                // selectedNode.onMousedown({x: x, y: y, context: box})
            } else {
                if (this.elemDown) {
                    box.cancleAllSelected()
                    selectedNode.selected = true
                    selectedNode.onMousedown({x: x, y: y, context: box})
                    box.currElement = selectedNode
                    box.selectedElements = []
                    box.selectedElements.push(selectedNode)
                }
            }
        } else if (box.selectedElements.length) {
            // box.cancleAllSelected()
            // box.selectedElements = []
        }


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
