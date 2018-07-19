/* eslint-disable */
import util from '../util'

// 连线插件
export default {
    name: 'join',
    onMousedown(e, box, x, y) {
        if (this.activePt) {
            this.startJoin = true
            this.startNode = this.hoverNode
            this.startX = x
            this.startY = y
            this.startPt = {
                x: this.activePt.relativeX,
                y: this.activePt.relativeY
            }
        }
    },
    onMousemove(e, box, x, y) {
        this._curX = x
        this._curY = y
        
        if (box.isOnMouseDown) {
            box.updateView()
            box.ctx.lineWidth = 1
            box.ctx.strokeStyle = '#f00'
            box.ctx.beginPath()
            box.ctx.moveTo(box.startDragMouseX, box.startDragMouseY)
            box.ctx.lineTo(x, y)
            box.ctx.stroke()
        }

        box.updateView()
        
        let offset = 8
        this.hoverNode = null
        this.joinPts = []
        this.activePt = null
        box.canvas.style.cursor = 'default'
        for (var i = box.nodes.length - 1; i >= 0; i--) {
            var node = box.nodes[i]
            if (node.type === 'link') {
                continue
            }
            if (node.x + node.width < 0 || node.x > box.canvas.width) continue
            
            if (x > node.x - offset && x < node.x + node.width + offset
                    && y > node.y - offset && y < node.y + node.height + offset) {
                box.ctx.strokeStyle = '#000'
                this.hoverNode = node
                
                this.joinPts = [
                    // top
                    {
                        x: node.x + node.width / 2,
                        y: node.y,
                        relativeX: 0.5,
                        relativeY: 0
                    },
                    // bottom
                    {
                        x: node.x + node.width / 2,
                        y: node.y + node.height,
                        relativeX: 0.5,
                        relativeY: 1
                    },
                    // left
                    {
                        x: node.x,
                        y: node.y + node.height / 2,
                        relativeX: 0,
                        relativeY: 0.5
                    },
                    // right
                    {
                        x: node.x + node.width,
                        y: node.y + node.height / 2,
                        relativeX: 1,
                        relativeY: 0.5
                    }
                ]
                for (let pt of this.joinPts) {
                    if (util.getDistance({x: this._curX, y: this._curY}, {x: pt.x, y: pt.y}) < 10) {
                        this.activePt = pt
                        box.canvas.style.cursor = 'crosshair'
                    }
                }
            } else {
            }
        }

        if (this.startJoin) {
            this.joinLine = {
                x: this.startX,
                y: this.startY,
                x2: x,
                y2: y
            }
        }
    },
    onMouseup(e, box, x, y) {
        let minX = Math.min(x, box.startDragMouseX)
        let minY = Math.min(y, box.startDragMouseY)
        let width = Math.abs(x - box.startDragMouseX)
        let height = Math.abs(y - box.startDragMouseY)
        
        this.joinLine = null
        this.startJoin = null
        this.joinPts = []
        if (this.activePt) {
            this.startX = x
            this.startY = y
            if (this.startNode.id === this.hoverNode.id && this.startPt.x === this.activePt.relativeX
                && this.startPt.y === this.activePt.relativeY) {
                for (let link of box.links) {
                    if (link.nodeA.node.id === this.startNode.id) {
                        if (link.nodeA.x === this.startPt.x && link.nodeA.y === this.startPt.y) {
                            box.removeElementById(link.id)
                            break
                        }
                    }
                    if (link.nodeB.node.id === this.startNode.id) {
                        if (link.nodeB.x === this.startPt.x && link.nodeB.y === this.startPt.y) {
                            box.removeElementById(link.id)
                            break
                        }
                    }
                }
            } else {
                // let line = new Topo.Line()
                // line.x = this.startX
                // line.y = this.startY
                // line.x2 = x
                // line.y2 = y
                // box.add(line)
                
                let link = new Topo.Link({
                    node: this.startNode,
                    x: this.startPt.x,
                    y: this.startPt.y
                }, {
                    node: this.hoverNode,
                    x: this.activePt.relativeX,
                    y: this.activePt.relativeY
                })
                box.setDefaultStyleToNode(link)
                box.add(link);
            }

            this.activePt = false
        }
        
        box.updateView()
        // box.mode = 'common'
    },
    draw(box) {
        if (this.joinPts && this.joinPts.length) {
            box.ctx.lineWidth = 2
            box.ctx.strokeStyle = '#000'
            box.ctx.fillStyle = '#fff'
            box.ctx.setLineDash([])
            for (let pt of this.joinPts) {
                box.ctx.beginPath()
                box.ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI)
                box.ctx.stroke()
                box.ctx.fill()
            }
        }
        if (this.joinLine) {
            box.ctx.beginPath()
            box.ctx.moveTo(this.joinLine.x, this.joinLine.y)
            box.ctx.lineTo(this.joinLine.x2, this.joinLine.y2)
            box.ctx.stroke()
        }
    }
}
