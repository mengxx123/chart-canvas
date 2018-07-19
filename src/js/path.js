/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */
import { Node } from './node'

class Path extends Node {
    constructor (name) {
        super(name)
        this.type = 'path'
    }

    getRect() {
        if (!this._rect) {
            let rectP = document.getElementById('svg').getBoundingClientRect()
            let path = document.getElementById('path')
            path.setAttribute('d', this.path)
            let rect = path.getBoundingClientRect()
            this._rect = {
                x: rect.x - rectP.x,
                y: rect.y - rectP.y,
                width: rect.width,
                height: rect.height
            }
            if (!this.showX && this.showX !== 0) {
                this.showX = this._rect.x
            }
            if (!this.showY && this.showY !== 0) {
                this.showY = this._rect.y
            }
            this.showWidth = this._rect.width
            if (!this.showWidth) {
            }
            this.showHeight = this._rect.height
            if (!this.showHeight) {
            }
        }
        return this._rect
    }

    get path() {
        return this._path
    }

    set path(value) {
        this._path = value
        this.getRect()
    }

    get x() {
        return this.showX
    }

    set x(value) {
        this.showX = value
    }

    get y() {
        return this.showY
    }

    set y(value) {
        this.showY = value
    }

    get width() {
        return this.showWidth
    }

    set width(value) {
        this.showWidth = value
    }

    get height() {
        return this.showHeight
    }

    set height(value) {
        this.showHeight = value
    }

    draw (ctx, canvas) {
        if (this.visible === false) {
            return
        }
        let rect = this.getRect()
        this.setContextStyle(ctx)
        ctx.save()
        ctx.translate(this.showX - rect.x * this.showWidth / rect.width,
            this.showY - rect.y * this.showHeight / rect.height)
        ctx.scale(this.showWidth / rect.width, this.showHeight / rect.height)
        ctx.beginPath()
        let path = new Path2D(this.path)
        ctx.fill(path)
        ctx.stroke(path)
        ctx.restore()
    }
}

export default Path
