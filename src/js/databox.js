/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */
/* eslint-disable */
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
        this.selection = null // 选区
        this.defaultStyle = {
            // fillColor: 'transparent',
            fillColor: null,
            strokeColor: '#000000',
            strokeWidth: 1,
            strokeDash: 0,
        }
        this.init()
    }

    init() {
        // this.ctx.shadowBlur = 5
        // this.ctx.shadowColor = 'rgba(0,0,0,0.5)'
        // this.ctx.shadowOffsetX = 3
        // this.ctx.shadowOffsetY = 6
        
        this.initPlugin()
        
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
        window.addEventListener('keydown', this.onKeydown = function (e) {
            return box.keydown(e)
        }, true)
        window.addEventListener('keyup', this.onKeyup = function (e) {
            return box.keyup(e)
        }, true)
    }

    setDefaultStyle() {
        this.ctx.fillStyle = this.defaultStyle.fillColor || 'transparent'
        this.ctx.lineWidth = this.defaultStyle.strokeWidth
        this.ctx.strokeStyle = this.defaultStyle.strokeColor || 'transparent'
        this.ctx.setLineDash([this.defaultStyle.strokeDash])
    }

    setDefaultStyleToNode(node) {
        node.style.fillColor = this.defaultStyle.fillColor || 'transparent'
        node.style.strokeWidth = this.defaultStyle.strokeWidth
        node.style.strokeColor = this.defaultStyle.strokeColor || 'transparent'
        node.style.strokeDash = this.defaultStyle.strokeDash
    }

    initPlugin() {
        // this.plugins.push()
    }

    addPlugin(plugin) {
        this.plugins.push(plugin)
    }

    addPlugins(plugins) {
        for (let plugin of plugins) {
            this.plugins.push(plugin)
        }
    }

    getElementByXY(x, y) {
        var e = null
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var node = this.nodes[i]
            if (!node.visible || node.lock) {
                continue
            }
            if (node.isPointInPath(x, y)) {
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

        box.isOnMouseDown = true
        box.startDragMouseX = x
        box.startDragMouseY = y
        
        box.publish('mousedown', {target: box.currElement, x: x, y: y, context: box})
        for (let plugin of this.plugins) {
            if (plugin.name === this.mode) {
                plugin.onMousedown && plugin.onMousedown(event, this, xy.x, xy.y)
                break
            }
        }
    }

    mousemove(event) {
        var box = this
        var xy = util.getXY(box, event)
        var x = xy.x
        var y = xy.y
        var dx = (x - box.startDragMouseX)
        var dy = (y - box.startDragMouseY)
        box.publish('mousemove', {target: box.currElement, x: x, y: y, dx: dx, dy: dy, context: box})

        for (let plugin of this.plugins) {
            if (plugin.name === this.mode) {
                plugin.onMousemove && plugin.onMousemove(event, this, xy.x, xy.y)
                break
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
        box.isOnMouseDown = false

        for (let plugin of this.plugins) {
            if (plugin.name === this.mode) {
                plugin.onMouseup && plugin.onMouseup(event, this, xy.x, xy.y)
                break
            }
        }
    }

    keydown(e) {
        if (document.activeElement.nodeName !== 'BODY') {
            return;
        }
        var box = this
        var keyID = e.keyCode ? e.keyCode : e.which
        box.publish('keydown', keyID)
        let grid = 4
        switch (keyID) {
            case 8: // Backspace
                this.removeSelectedElement()
                return false
            case 27: // Esc
                this.cancleAllSelected()
                this.currElement = null
                return false
            case 38: // up arrow and W
            case 87:
                if (e.ctrlKey) {
                    this.dealSelectedElement(elem => {
                        if (elem.height > grid) {
                            elem.height -= grid
                        }
                    })
                } else {
                    this.dealSelectedElement(elem => {
                        elem.y -= grid
                    })
                }
                return false
            case 39: // right arrow and D
            case 68:
                if (e.ctrlKey) {
                    this.dealSelectedElement(elem => {
                        elem.width += grid
                    })
                } else {
                    this.dealSelectedElement(elem => {
                        elem.x += grid
                    })
                }
                e.preventDefault()
                return false
            case 40: // down arrow and S
            case 83:
                if (e.ctrlKey) {
                    this.dealSelectedElement(elem => {
                        elem.height += grid
                    })
                } else {
                    this.dealSelectedElement(elem => {
                        elem.y += grid
                    })
                }
                e.preventDefault()
                return false
            case 37: // left arrow and A
            case 65:
                if (e.ctrlKey) {
                    this.dealSelectedElement(elem => {
                        if (elem.width > grid) {
                            elem.width -= grid
                        }
                    })
                } else {
                    this.dealSelectedElement(elem => {
                        elem.x -= grid
                    })
                }
                e.preventDefault()
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
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id) {
                this.remove(this.elements[i])
                break
            }
        }
    }

    remove(element) {
        if (element.selected) {
            for (let i = 0; i < this.selectedElements.length; i++) {
                if (this.selectedElements[i].id === element.id) {
                    this.selectedElements.splice(i, 1)
                    break
                }
            }
        }
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
            // this.links.push(element)
            this.nodes.push(element)
        } else {
            // element instanceof Node
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

        for (let link of this.links) {
            if (link.nodeA.x + link.nodeA.width < 0 || link.nodeA.x > box.canvas.width) {
                continue
            }
            if (link.nodeB.x + link.nodeA.width < 0 || link.nodeB.x > box.canvas.width) {
                continue
            }
            link.draw(this.ctx)
        }

        for (var i = 0; i < this.containers.length; i++) {
            var c = this.containers[i]
            if (c.x + c.width < 0 || c.x > box.canvas.width) continue

            this.containers[i].draw(this.ctx)
        }

        let hasResize = false
        this._resizePts = []
        for (let node of this.nodes) {
            if (node.x + node.width < 0 || node.x > box.canvas.width) {
                continue
            }
            node.draw(this.ctx, this.canvas)
            node.drawText(this.ctx, this.canvas)
            node._drawName(this.ctx, this.canvas)
            if (node.isSelected() || node.isFocus()) {
                node.drawSelectedRect(this.ctx)
                if (node.isSelected() && !hasResize) {
                    hasResize = true
                    if (this.selectedElements.length === 1) {
                        this.drawResizeBox(node)
                    }
                }
            }
        }

        // plugin
        for (let plugin of this.plugins) {
            if (plugin.name === this.mode) {
                plugin.draw && plugin.draw(this)
                break
            }
        }
    }

    drawResizeBox(node) {
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = '#000'
        this.ctx.fillStyle = '#000'
        this.ctx.beginPath()
        let x = node.x
        let y = node.y
        let width = node.getWidth()
        let height = node.getHeight()
        this.ctx.rect(node.x, node.y, node.getWidth(), node.getHeight())
        this.ctx.stroke()

        function drawCircle(ctx, x, y) {
            ctx.lineWidth = 2
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
        }
        this._resizeNode = node
        this._resizePts = node.getControlPts()
        for (let pt of this._resizePts) {
            drawCircle(this.ctx, pt.x, pt.y)
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

    autoUpdate() {
        let lastTime = 0
        this.updating = false
        this._timer = setInterval(() => {
            let time = new Date().getTime()
            if (this.updating) {
                // alert(1)
            }
            this.updating = true
            this.updateView()
            this.updating = false
        }, 50)
    }

    destroy() {
        clearInterval(this._timer)
        this.canvas.onmousedown = null
        this.canvas.onmousemove = null
        this.canvas.onmouseup = null
        window.removeEventListener('keydown', this.onKeydown)
        window.addEventListener('keyup', this.onKeyup)
    }

    moveIndexTop() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id === this.currElement.id) {
                this.nodes.splice(i, 1)
                break
            }
        }
        this.nodes.unshift(this.currElement)
    }

    moveIndexBottom() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id === this.currElement.id) {
                this.nodes.splice(i, 1)
                break
            }
        }
        this.nodes.push(this.currElement)
    }

    moveIndexUp() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id === this.currElement.id) {
                if (i !== this.nodes.length - 1) {
                    this.nodes.splice(i, 1)
                    this.nodes.splice(i + 1, 0, this.currElement)
                }
                break
            }
        }
    }

    moveIndexDown() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id === this.currElement.id) {
                if (i !== 0) {
                    this.nodes.splice(i, 1)
                    this.nodes.splice(i - 1, 0, this.currElement)
                }
                break
            }
        }
    }

    alignLft() {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].x = 0
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].x = this.selectedElements[0].x
            }
        }
    }

    alignCenter() {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].x = (this.width - this.selectedElements[0].width) / 2
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].x = this.selectedElements[0].x +
                    this.selectedElements[0].width / 2 - this.selectedElements[i].width / 2
            }
        }
    }

    alignRight() {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].x = this.width - this.selectedElements[0].width
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].x = this.selectedElements[0].x +
                    this.selectedElements[0].width - this.selectedElements[i].width
            }
        }
    }

    alignTop() {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].y = 0
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].y = this.selectedElements[0].y
            }
        }
    }

    alignMiddle() {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].y = (this.height - this.selectedElements[0].height) / 2
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].y = this.selectedElements[0].y +
                    this.selectedElements[0].height / 2 - this.selectedElements[i].height / 2
            }
        }
    }

    alignBottom() {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].y = this.height - this.selectedElements[0].height
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].y = this.selectedElements[0].y +
                    this.selectedElements[0].height - this.selectedElements[i].height
            }
        }
    }

    alignWidth(widthScale) {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].width = this.width * widthScale
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].width = this.selectedElements[0].width * widthScale
            }
        }
    }

    alignHeight(heightScale) {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].height = this.height * heightScale
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].height = this.selectedElements[0].height * heightScale
            }
        }
    }

    alignOffsetX(offset) {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].x = offset
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].x = this.selectedElements[i - 1].x + this.selectedElements[i - 1].width + offset
            }
        }
    }

    alignOffsetY(offset) {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].y = offset
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].y = this.selectedElements[i - 1].y + this.selectedElements[i - 1].height + offset
            }
        }
    }

    alignOffsetX2(offset) {
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].x = offset
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].x = this.selectedElements[i - 1].x + offset
            }
        }
    }

    alignOffsetY2(offset) {
        console.log('什么情况')
        if (this.selectedElements.length === 1) {
            this.selectedElements[0].y = offset
        } else {
            for (let i = 1; i < this.selectedElements.length; i++) {
                this.selectedElements[i].y = this.selectedElements[i - 1].y + offset
            }
        }
    }
}

export default DataBox