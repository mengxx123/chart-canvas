/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */
import { Node } from './node'

// 绘制椭圆
function ellipse(context, x, y, a, b) {
    context.save()
    var r = (a > b) ? a : b
    var ratioX = a / r
    var ratioY = b / r
    context.scale(ratioX, ratioY)
    context.beginPath()
    context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false)
    context.closePath()
    context.restore()
    context.stroke()
}

function myEllipse(context, x, y, width, height) {
    ellipse(context, x + width / 2, y + height / 2, width / 2, height / 2)
}

class Ellipse extends Node {
    constructor (name) {
        super(name)
        this.type = 'ellipse'
    }

    draw (ctx) {
        if (this.visible === false) {
            return
        }
        this.setContextStyle(ctx)
        ctx.beginPath()
        myEllipse(ctx, this.x, this.y, this.width, this.height)
        // ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
        ctx.stroke()
    }
}

export default Ellipse
