/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */
import { Node } from './node'

class Text extends Node {
    constructor(name) {
        super(name)
        this.type = 'text'
        this.text = ''
    }

    // drawCorePath(ctx) {
    //     ctx.rect(this.x, 0, this.r, 0, Math.PI * 2)
    // }

    draw(ctx) {
        // if (this.visible === false) {
        //     return
        // }
        // if (!this.text) {
        //     return
        // }
        // let textWidth = ctx.measureText(this.text).width
        // ctx.font = this.style.textSize + 'px ' + this.style.font
        // ctx.lineWidth = 1
        // ctx.strokeStyle = this.style.textColor
        // ctx.fillStyle = this.style.textColor
        // ctx.textAlign = 'center'
        // ctx.textBaseline = 'middle'
        // ctx.setLineDash([])
        // ctx.beginPath()
        // ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
    }
}

export default Text
