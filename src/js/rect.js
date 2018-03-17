/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */
import { Node } from './node'

class Circle extends Node {
  constructor(name) {
    super(name)

    this.r = 30
    this.beginDegree = 0
    this.endDegree = 2 * Math.PI
  }

  draw (ctx) {
    if (this.visible === false) return
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
  }

  draw (ctx) {
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

export { Circle, Rect, Line }
