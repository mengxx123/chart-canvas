/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */

import {Container} from './container'
import {Link} from './link'
import {Node} from './node'
import util from './util'
import Layout from './layout'

class DataBox {

    constructor(name, canvas) {
        this.name = name
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.messageBus = new util.MessageBus()
        this.image = new Image()
        this.image.src = '/static/img/bg.jpg'
        this.children = []
        this.viewBox = [0, 0, 800, 500]
        this.plugins = []

        this.init()
    }

    init() {
        // this.ctx.shadowBlur = 5
        // this.ctx.shadowColor = 'rgba(0,0,0,0.5)'
        // this.ctx.shadowOffsetX = 3
        // this.ctx.shadowOffsetY = 6
        // 矩形插件
        this.plugins.push({
            name: 'rect',
            onMousemove(box, x, y) {
                if (box.isOnMouseDown) {
                    box.updateView()
                    box.ctx.fillStyle = '#f00'
                    let minX = Math.min(x, box.startDragMouseX)
                    let minY = Math.min(y, box.startDragMouseY)
                    box.ctx.fillRect(minX, minY, 
                        Math.abs(x - box.startDragMouseX), Math.abs(y - box.startDragMouseY))
                }
            },
            onMouseup(box, x, y) {
                let minX = Math.min(x, box.startDragMouseX)
                let minY = Math.min(y, box.startDragMouseY)
                let width = Math.abs(x - box.startDragMouseX)
                let height = Math.abs(y - box.startDragMouseY)
                var hostNode = new Topo.Rect()
                hostNode.setSize(width, height)
                hostNode.setLocation(minX, minY)
                box.add(hostNode)
                box.updateView()
                box.mode = 'common'
            }
        })
        // 直线插件
        this.plugins.push({
            name: 'line',
            onMousemove(box, x, y) {
                if (box.isOnMouseDown) {
                    box.updateView()
                    box.ctx.lineWidth = 1
                    box.ctx.strokeStyle = '#f00'
                    box.ctx.beginPath()
                    box.ctx.moveTo(box.startDragMouseX, box.startDragMouseY)
                    box.ctx.lineTo(x, y)
                    box.ctx.stroke()
                }
            },
            onMouseup(box, x, y) {
                let minX = Math.min(x, box.startDragMouseX)
                let minY = Math.min(y, box.startDragMouseY)
                let width = Math.abs(x - box.startDragMouseX)
                let height = Math.abs(y - box.startDragMouseY)
                
                let line = new Topo.Line()
                line.x = box.startDragMouseX
                line.y = box.startDragMouseY
                line.x2 = x
                line.y2 = y
                box.add(line)
                box.updateView()
                box.mode = 'common'
            }
        })
        // 圆形插件
        this.plugins.push({
            name: 'round',
            onMousemove(box, x, y) {
                if (box.isOnMouseDown) {
                    box.updateView()
                    let minX = Math.min(x, box.startDragMouseX)
                    let minY = Math.min(y, box.startDragMouseY)
                    let radius = Math.sqrt(Math.pow(x - box.startDragMouseX, 2) + Math.pow(y - box.startDragMouseY, 2))
                    
                    box.ctx.fillStyle = '#f00'
                    box.ctx.beginPath()
                    box.ctx.arc(box.startDragMouseX, box.startDragMouseY, radius, 0, 2 * Math.PI)
                    box.ctx.fill()
                }
            },
            onMouseup(box, x, y) {
                let radius = Math.sqrt(Math.pow(x - box.startDragMouseX, 2) + Math.pow(y - box.startDragMouseY, 2))
                var node = new Topo.Circle()
                node.r = radius
                node.setLocation(box.startDragMouseX - radius, box.startDragMouseY - radius)
                box.add(node)
                box.updateView()
                box.mode = 'common'
            }
        })
        this.startDragMouseX = 0
        this.startDragMouseY = 0
        this.offset = $(canvas).offset()
        this.isRangeSelectable = true

        this.elements = []
        this.containers = []
        this.links = []
        this.nodes = []
        this.elementMap = {}
        this.selectedElements = []

        var box = this
        this.canvas.onmousedown = function (event) {
            box.isMousedown = true
            box.mousedown(event)
        }
        this.canvas.onmousemove = function (event) {
            box.mousemove(event)
        }
        this.canvas.onmouseup = function (event) {
            box.isMousedown = false
            box.mouseup(event)
        }
        window.addEventListener('keydown', function (e) {
            box.keydown(e)
        }, true)
        window.addEventListener('keyup', function (e) {
            box.keyup(e)
        }, true)

        setTimeout(function () {
            box.updateView()
        }, 300)
    }

    getElementByXY(x, y) {
        var e = null
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var node = this.nodes[i]
            if (x > node.x && x < node.x + node.width && y > node.y && y < node.y + node.height) {
                e = node
                break
            }
        }
        if (!e) {
            for (var i = this.containers.length - 1; i >= 0; i--) {
                var group = this.containers[i]
                if (x > group.x && x < group.x + group.width && y > group.y && y < group.y + group.height) {
                    e = group
                    break
                }
            }
        }
        return e
    }

    // 搜索，并选中匹配的元素 TODO 定位匹配的元素
    search(keyword) {
        this.cancleAllSelected()
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i]
            if (node.name && node.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                node.selected = true
                this.selectedElements.push(node)
            }
        }
        this.updateView()
    }

    getElementByName(name) {
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].getName() == name) {
                return this.nodes[i]
            }
        }
        return null
    }

    findCloserNode(node, cond) {
        var min = {distance: Number.MAX_VALUE, node: null}
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var typeNode = this.nodes[i]
            if (typeNode === node) continue
            if (cond(typeNode) == true) {
                var dist = util.getDistance(node, typeNode)
                if (dist < min.distance) {
                    min.node = typeNode
                    min.distance = dist
                }
            }
        }
        return min.node
    }

    cancleAllSelected() {
        for (var i = 0; i < this.selectedElements.length; i++) {
            this.selectedElements[i].cancleSelected()
        }
        this.selectedElements = []
    }

    mousedown(event) {
        var box = this
        var xy = util.getXY(box, event)
        var x = xy.x
        var y = xy.y

        var selectedNode = box.getElementByXY(x, y)
        if (selectedNode) {
            if (this.ctrlDown) {
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

        box.startDragMouseX = x
        box.startDragMouseY = y

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

        box.isOnMouseDown = true
        box.publish('mousedown', {target: box.currElement, x: x, y: y, context: box})
    }

    mousemove(event) {
        var box = this
        var xy = util.getXY(box, event)
        var x = xy.x
        var y = xy.y
        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)
        box.publish('mousemove', {target: box.currElement, x: x, y: y, dx: dx, dy: dy, context: box})

        if (this.mode !== 'common') {
            for (let plugin of this.plugins) {
                if (plugin.name === this.mode) {
                    plugin.onMousemove && plugin.onMousemove(this, xy.x, xy.y)
                    break
                }
            }
            return
        }

        //if(box.currElement && !box.currElement.isDragable()) return

        box.updateView()
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var node = this.nodes[i]
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
            box.ctx.beginPath()
            box.ctx.fillStyle = 'rgba(168,202,236,0.5)'
            box.ctx.fillRect(startx, starty, width, height)
            box.ctx.closePath()

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
    }

    mouseup(event) {
        var box = this
        var xy = util.getXY(this, event)
        var x = xy.x
        var y = xy.y
        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)

        box.publish('mouseup', {target: box.currElement, x: x, y: y, dx: dx, dy: dy, context: box})
        // box.startDragMouseX = null

        if (box.currElement) {
            box.currElement.onMouseup({x: x, y: y, context: box, dx: dx, dy: dy})
        }

        box.updateView()
        box.isOnMouseDown = false

        if (this.mode !== 'common') {
            for (let plugin of this.plugins) {
                if (plugin.name === this.mode) {
                    plugin.onMouseup && plugin.onMouseup(this, xy.x, xy.y)
                    break
                }
            }
            return
        }
    }

    keydown(e) {
        var box = this
        var keyID = e.keyCode ? e.keyCode : e.which
        box.publish('keydown', keyID)
        // box.updateView()

        switch (keyID) {
            case 8: // Backspace
                this.removeSelectedElement()
                return false
            case 27: // Esc
                this.cancleAllSelected()
                this.currElement = null
                box.updateView()
                return false
            case 38: // up arrow and W
            case 87:
                this.dealSelectedElement(elem => {
                    elem.y -= 5
                })
                box.updateView()
                return false
            case 39: // right arrow and D
            case 68:
                this.dealSelectedElement(elem => {
                    elem.x += 5
                })
                box.updateView()
                return false
            case 40: // down arrow and S
            case 83:
                this.dealSelectedElement(elem => {
                    elem.y += 5
                })
                box.updateView()
                return false
            case 37: // left arrow and A
            case 65:
                this.dealSelectedElement(elem => {
                    elem.x -= 5
                })
                box.updateView()
                return false
            case 17:
                this.ctrlDown = true
                break
        }
    }

    keyup(e) {
        var box = this
        var keyID = e.keyCode ? e.keyCode : e.which
        box.publish('keyup', keyID)
        switch (e.keyCode) {
            case 17:
                this.ctrlDown = false
                break
        }
        box.updateView()
    }

    subscribe(topic, action) {
        this.messageBus.subscribe(topic, action)
        return this
    }

    publish(topic, msg) {
        this.messageBus.publish(topic, msg)
        return this
    }

    removeElementById(id) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id) {
                this.remove(i)
                break
            }
        }
    }

    remove(element) {
        this.elements = this.elements.del(element)
        this.containers = this.containers.del(element)
        this.links = this.links.del(element)
        this.nodes = this.nodes.del(element)
        this.elementMap[element.id] = element
    }

    // 移除所有选中的元素
    removeSelectedElement() {
        let _this = this
        for (let elem of this.selectedElements) {
            _this.remove(elem)
        }
        this.selectedElement = null
        this.selectedElements = []
        this.updateView()
    }

    dealSelectedElement(callback) {
        this.selectedElements.forEach(item => {
            callback(item)
        })
    }

    addElement(e) {
        return this.add(e)
    }

    add(element) {
        if (this.elementMap[element.id]) { // 防止重复添加？
            return
        }
        if (!element.id) {
            element.id = $.now()
        }
        if (!element.z) {
            element.z = this.elements.length
        }
        this.elements.push(element)

        if (element instanceof Container) {
            this.containers.push(element)
        } else if (element instanceof Link) {
            this.links.push(element)
        } else if (element instanceof Node) {
            this.nodes.push(element)
        }
        this.elementMap[element.id] = element
    }

    clear() {
        this.elements = []
        this.links = []
        this.nodes = []
        this.containers = []
        this.elementMap = {}
    }

    getChilds(node) {
        var result = []
        for (var i = 0; i < this.links.length; i++) {
            if (this.links[i].nodeA === node) {
                result.push(this.links[i].nodeB)
            }
        }
        return result
    }

    getNodesBound(nodes) {
        var bound = {x: 10000000, y: 1000000, width: 0, height: 0}
        if (nodes.length > 0) {
            var minX = 10000000
            var maxX = -10000000
            var minY = 10000000
            var maxY = -10000000
            var width = maxX - minX
            var height = maxY - minY
            for (var i = 0; i < nodes.length; i++) {
                var item = nodes[i]
                if (item.x <= minX) {
                    minX = item.x
                }
                if (item.x >= maxX) {
                    maxX = item.x
                }
                if (item.y <= minY) {
                    minY = item.y
                }
                if (item.y >= maxY) {
                    maxY = item.y
                }
                width = maxX - minX + item.width
                height = maxY - minY + item.height
            }

            bound.x = minX
            bound.y = minY
            bound.width = width
            bound.height = height
            return bound
        }
        return null
    }

    isAllChildIsEndpoint(node) {
        var childs = this.getChilds(node)
        for (var i = 0; i < childs.length; i++) {
            var grandsons = this.getChilds(childs[i])
            if (grandsons.length > 0) return false
        }
        return true
    }

    getBoundRecursion(node) {
        var childs = this.getChilds(node)
        if (childs.length == 0) return node.getBound()
        return this.getNodesBound(childs)
    }

    layoutNode(node) {
        var childs = this.getChilds(node)
        if (childs.length == 0) return node.getBound()

        this.adjustPosition(node)
        if (this.isAllChildIsEndpoint(node)) {
            return null
        }
        for (var i = 0; i < childs.length; i++) {
            this.layoutNode(childs[i])
        }
        return null
    }

    adjustPosition(node) {
        var childs = this.getChilds(node)
        var layout = node.layout
        var type = layout.type
        var points = null
        if (type == 'star') {
            points = Layout.getStarPositions(node.x, node.y, childs.length, node.layout.radius,
                    node.layout.beginDegree, node.layout.endDegree)
        } else if (type == 'tree') {
            points = Layout.getTreePositions(node.x, node.y, childs.length, layout.width,
                    layout.height, layout.direction)
        }
        for (var i = 0; i < childs.length; i++) {
            childs[i].setLocation(points[i].x, points[i].y)
        }
    }

    getParents(node) {
        var result = []
        for (var i = 0; i < this.links.length; i++) {
            if (this.links[i].nodeB === node) {
                result.push(this.links[i].nodeA)
            }
        }
        return result
    }

    updateView() {
        var box = this
        var nodes = this.nodes

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        if (this.image != null) {
            this.ctx.drawImage(this.image, 0, 0)
        }

        for (var i = 0; i < this.links.length; i++) {
            var link = this.links[i]
            if (link.nodeA.x + link.nodeA.width < 0 || link.nodeA.x > box.canvas.width) continue
            if (link.nodeB.x + link.nodeA.width < 0 || link.nodeB.x > box.canvas.width) continue

            link.draw(this.ctx)
        }

        for (var i = 0; i < this.containers.length; i++) {
            var c = this.containers[i]
            if (c.x + c.width < 0 || c.x > box.canvas.width) continue

            this.containers[i].draw(this.ctx)
        }

        for (var i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i]
            if (this.nodes[i].x + this.nodes[i].width < 0 || this.nodes[i].x > box.canvas.width) continue
            this.nodes[i].draw(this.ctx)
            if (node.isSelected() || node.isFocus()) {
                node.drawSelectedRect(this.ctx)
            }
        }
    }

    // 导出 JSON
    getJson() {
        let obj = {
            version: '1.0',
            title: '测试文件'
        }
        return JSON.stringify(obj)
    }

    // 加载 JSON
    loadJson(json) {
        let obj = JSON.parse(json)
        // if (obj.version) {
        //
        // }
    }
}

export default DataBox