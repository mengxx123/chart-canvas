/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */
import { Node } from './node'

class Circle extends Node {
    constructor(name) {
        super(name)
        this.type = 'circle'
        this.r = 30
        this.beginDegree = 0
        this.endDegree = 2 * Math.PI
    }

    setWidth(width) {
        this.r = width / 2
    }

    setHeight(height) {
        this.r = height / 2
    }

    isPointInPath(x, y) {
        let cx = this.x + this.r
        let cy = this.y + this.r
        return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) < this.r
    }

    drawCorePath(ctx) {
        ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    }

    draw(ctx) {
        if (this.visible === false) {
            return
        }
        var w = this.r * 2 * this.scala
        var h = this.r * 2 * this.scala
        this.width = w
        this.height = h
        this.setContextStyle(ctx)
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.x + w / 2, this.y + h / 2, w / 2, this.beginDegree, this.endDegree, true)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}

class Rect extends Node {
    constructor (name) {
        super(name)
        this.type = 'rect'
    }

    draw (ctx) {
        if (this.visible === false) {
            return
        }
        this.setContextStyle(ctx)
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
        ctx.stroke()
    }
}

class Line extends Node {
    constructor (name) {
        super(name)
        this.type = 'line'
    }

    // getControlPts() {
    //     return [
    //         {
    //             name: 'start',
    //             x: this.x,
    //             y: this.y,
    //             cursor: 'move'
    //         },
    //         {
    //             name: 'end',
    //             x: this.x2,
    //             y: this.y2,
    //             cursor: 'move'
    //         }
    //     ]
    // }

    setWidth(width) {
        this.x2 = this.x + width
    }

    setHeight(height) {
        this.y2 = this.y + height
    }

    getWidth() {
        return Math.abs(this.x - this.x2)
    }

    getHeight() {
        return Math.abs(this.y - this.y2)
    }

    isPointInPath(x, y) {
        let minX = Math.min(this.x, this.x2)
        let minY = Math.min(this.y, this.y2)
        let width = Math.abs(this.x - this.x2)
        let height = Math.abs(this.y - this.y2)
        return x > minX && x < minX + width && y > minY && y < minY + height
    }

    drawCorePath(ctx) {
        let width = Math.abs(this.x - this.x2)
        let height = Math.abs(this.y - this.y2)
        let halfWidth = width / 2
        let halfHeight = height / 2
        ctx.moveTo(0 - halfWidth, 0 - halfHeight)
        ctx.lineTo(halfWidth, halfHeight)
    }

    setLocation(x, y) {
        let offsetX = x - this.x
        let offsetY = y - this.y
        this.x = x
        this.y = y
        this.x2 += offsetX
        this.y2 += offsetY
        return this
    }

    draw(ctx) {
        if (this.visible === false) {
            return
        }

        this.setContextStyle(ctx)
        // TODO 透明度支持
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()
    }
}

class Image extends Node {
    constructor (name) {
        super(name)
        this.type = 'image'
    }

    draw (ctx) {
        if (this.visible === false) {
            return
        }
        this.setContextStyle(ctx)
        ctx.beginPath()
        if (this._img) {
            ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, this.x, this.y, this.width, this.height)
            return
        }
        // ctx.rect(this.x, this.y, this.width, this.height)
        this._img = new window.Image()
        this._img.onload = () => {
            ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, this.x, this.y, this.width, this.height)
        }
        this._img.src = this.image
        // ctx.fill()
        // ctx.stroke()
    }
}

export { Circle, Rect, Line, Image }
