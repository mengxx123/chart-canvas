import {Node} from './node'

/* eslint-disable */
class Link extends Node {

    constructor(nodeA, nodeB) {
        super(null)
        this.nodeA = nodeA
        this.nodeB = nodeB
        this.type = 'link'
        // TODO 跟 Node 重复
        this.style = {
            strokeColor: '#666',
            strokeWidth: 1,
            fillColor: '#ff0000',
            strokeDash: 0,
            fontSize: '10pt',
            font: "Consolas"
        }
        // this.style = {strokeStyle: '116, 166, 250', alpha: 1, lineWidth: 2}
    }

    // TODO 跟 Node 重复
    setContextStyle(ctx) {
        ctx.fillStyle = this.style.fillColor
        ctx.strokeStyle = this.style.strokeColor
        ctx.lineWidth = this.style.strokeWidth
        ctx.setLineDash([this.style.strokeDash])
    }

    draw(ctx) {
        ctx.save()
        ctx.beginPath()
        this.setContextStyle(ctx)
        let startPt = this.getStartPt()
        let endPt = this.getEndPt()
        ctx.moveTo(startPt.x, startPt.y)
        ctx.lineTo(endPt.x, endPt.y)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
        this.drawText(ctx)
    }

    drawCorePath(ctx) {
        // ctx.moveTo(startPt.x, startPt.y)
        // ctx.lineTo(endPt.x, endPt.y)
        // ctx.arc(0, 0, 10, 0, Math.PI * 2)
    }

    getControlPts() {
        return [
        ]
    }

    get x() {
        return Math.min(this.getStartPt().x, this.getEndPt().x)
    }

    set x(value) {
    }

    get y() {
        return Math.min(this.getStartPt().y, this.getEndPt().y)
    }

    set y(value) {
    }

    get width() {
        return Math.abs(this.getStartPt().x - this.getEndPt().x)
    }

    set width(value) {
    }

    get height() {
        return Math.abs(this.getStartPt().y - this.getEndPt().y)
    }

    set height(value) {
    }

    drawText(ctx) {
        if (this.name) {
            let startPt = this.getStartPt()
            let endPt = this.getEndPt()
            let center = {
                x: (startPt.x + endPt.x) / 2,
                y: (startPt.y + endPt.y) / 2
            }
            
            // draw text background
            ctx.fillStyle = '#fff'
            ctx.strokeStyle = '#eee'
            ctx.lineWidth = 1
            ctx.beginPath()
            let textWidth = ctx.measureText(this.name).width
            ctx.rect(center.x - 20, center.y - 20, textWidth + 40, 32)
            ctx.fill()
            ctx.stroke()

            // draw text
            ctx.strokeStyle = '#333'
            ctx.lineWidth = 1
            ctx.font="14px 微软雅黑";
            ctx.setLineDash([])
            ctx.beginPath()
            ctx.strokeText(this.name, center.x, center.y)
        }
    }

    getStartPt() {
        if (this.nodeA.node) {
            return {
                x: this.nodeA.node.x + this.nodeA.node.width * this.nodeA.x,
                y:  this.nodeA.node.y + this.nodeA.node.height * this.nodeA.y
            }
        } else {
            return {
                x: this.nodeA.x,
                y: this.nodeA.y
            }
        }
    }

    getEndPt() {
        if (this.nodeB.node) {
            return {
                x: this.nodeB.node.x + this.nodeB.node.width * this.nodeB.x,
                y:  this.nodeB.node.y + this.nodeB.node.height * this.nodeB.y
            }
        } else {
            return {
                x: this.nodeB.x,
                y: this.nodeB.y
            }
        }
    }

    getLength() {
        return getDistance(this.nodeA.node , this.nodeB.node)
    }
}

class FoldLink extends Link {

    constructor(nodeA, nodeB) {
        super(nodeA, nodeB)
        this.fold = 'x'
    }

    draw(ctx) {
        var x1 = this.nodeA.node.x
        var y1 = this.nodeA.node.y
        var x2 = this.nodeB.node.x
        var y2 = this.nodeB.node.y
        var mx = x1
        var my = y1

        let startPt = this.getStartPt()
        let endPt = this.getEndPt()
        if(x1 == x2 || y1 == y2){
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
            ctx.lineWidth = this.style.lineWidth
            ctx.moveTo(startPt.x, startPt.y)
            ctx.lineTo(endPt.x, endPt.y)
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
        }else{
            if(this.fold == 'x'){
                mx = x1 + (x2 - x1)
            }else{
                my = y1 + (y2 - y1)
            }
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
            ctx.lineWidth = this.style.lineWidth
            ctx.moveTo(x1 + this.nodeA.node.width / 2, y1+ this.nodeA.node.height / 2)
            ctx.lineTo(mx + this.nodeA.node.width / 2, my+ this.nodeA.node.height / 2)
            ctx.lineTo(x2 + this.nodeA.node.width / 2, y2+ this.nodeA.node.height / 2)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }
    }
}

class CurveLink extends Link {

    constructor(nodeA, nodeB) {
        super(nodeA, nodeB)
        this.curve = 0.5
    }

    draw(ctx) {
        var x1 = this.nodeA.node.x
        var y1 = this.nodeA.node.y
        var x2 = this.nodeB.node.x
        var y2 = this.nodeB.node.y
        var mx = x1
        var my = y1

        mx = x1 + (x2 - x1)
        my = y1 + (y2 - y1)

        mx *= this.curve
        my *= this.curve

        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
        ctx.lineWidth = this.style.lineWidth
        ctx.moveTo(x1 + this.nodeA.node.width / 2, y1+ this.nodeA.node.height / 2)
        ctx.quadraticCurveTo(mx + this.nodeA.node.width / 2, my+ this.nodeA.node.height / 2,
                x2 + this.nodeA.node.width / 2, y2+ this.nodeA.node.height / 2)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}

function ArrowsLink(nodeA, nodeB){
    var link = new Link(nodeA, nodeB)
    link.angle = 0.4
    link.offset = 30
    //link.style.fillStyle = '116, 166, 250'
    link.draw = function(ctx){
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
        ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.style.alpha + ')'
        ctx.lineWidth = this.style.lineWidth

        var ta = {x: this.nodeA.x + this.nodeA.width/2, y:this.nodeA.y + this.nodeA.height/2}
        var t = {x: this.nodeB.x + this.nodeB.width/2, y:this.nodeB.y + this.nodeB.height/2}

        var angle = Math.atan2(ta.y - t.y, ta.x - t.x)
        t.x = t.x + Math.cos(angle) * this.nodeB.width/2
        t.y = t.y + Math.sin(angle) * this.nodeB.height/2

        var da = 0.4
        var pointA = {x: t.x + Math.cos(angle-da) * this.offset,
            y: t.y + Math.sin(angle-da) * this.offset}

        var pointB = {x: t.x + Math.cos(angle+da) * this.offset,
            y: t.y + Math.sin(angle+da) * this.offset}

        ctx.moveTo(this.nodeA.x + this.nodeA.width / 2, this.nodeA.y + this.nodeA.height / 2)
        //ctx.lineTo(this.nodeB.x + this.nodeB.width / 2, this.nodeB.y + this.nodeB.height / 2)
        ctx.lineTo(pointA.x + (pointB.x - pointA.x)/2, pointA.y + (pointB.y - pointA.y)/2)

        ctx.moveTo(pointA.x , pointA.y)
        ctx.lineTo(t.x, t.y)
        ctx.lineTo(pointB.x, pointB.y)
        ctx.lineTo(pointA.x , pointA.y)
        if(this.style.fillStyle != null){
            ctx.fill()
        }
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
    return link
}

function ArrowsFoldLink(nodeA, nodeB) {
    var link = new Link(nodeA, nodeB)
    link.fold = 'x'
    link.angle = 0.4
    link.offset = 30

    link.draw = function (ctx) {
        var x1 = this.nodeA.x
        var y1 = this.nodeA.y
        var x2 = this.nodeB.x
        var y2 = this.nodeB.y
        var mx = x1
        var my = y1

        if(x1 == x2 || y1 == y2){
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
            ctx.lineWidth = this.style.lineWidth

            var ta = {x: this.nodeA.x + this.nodeA.width/2, y:this.nodeA.y + this.nodeA.height/2}
            var t = {x: this.nodeB.x + this.nodeB.width/2, y:this.nodeB.y + this.nodeB.height/2}

            var angle = Math.atan2(ta.y - t.y, ta.x - t.x)
            t.x = t.x + Math.cos(angle) * this.nodeB.width/2
            t.y = t.y + Math.sin(angle) * this.nodeB.height/2

            var da = 0.4
            var pointA = {x: t.x + Math.cos(angle-da) * this.offset,
                y: t.y + Math.sin(angle-da) * this.offset}

            var pointB = {x: t.x + Math.cos(angle+da) * this.offset,
                y: t.y + Math.sin(angle+da) * this.offset}

            ctx.lineTo(pointA.x + (pointB.x - pointA.x)/2, pointA.y + (pointB.y - pointA.y)/2)

            ctx.moveTo(pointA.x , pointA.y)
            ctx.lineTo(t.x, t.y)
            ctx.lineTo(pointB.x, pointB.y)
            ctx.lineTo(pointA.x , pointA.y)
            if(this.style.fillStyle != null){
                ctx.fill()
            }
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
        }else{
            if(this.fold == 'x'){
                mx = x1 + (x2 - x1)
            }else{
                my = y1 + (y2 - y1)
            }
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
            ctx.lineWidth = this.style.lineWidth
            ctx.moveTo(x1 + this.nodeA.width / 2, y1+ this.nodeA.height / 2)
            ctx.lineTo(mx + this.nodeA.width / 2, my+ this.nodeA.height / 2)

            var ta = {x: mx + this.nodeA.width / 2, y: my+ this.nodeA.height / 2}
            var t = {x: this.nodeB.x + this.nodeB.width/2, y:this.nodeB.y + this.nodeB.height/2}

            var angle = Math.atan2(ta.y - t.y, ta.x - t.x)
            t.x = t.x + Math.cos(angle) * this.nodeB.width/2
            t.y = t.y + Math.sin(angle) * this.nodeB.height/2

            var da = 0.4
            var pointA = {x: t.x + Math.cos(angle-da) * this.offset,
                y: t.y + Math.sin(angle-da) * this.offset}

            var pointB = {x: t.x + Math.cos(angle+da) * this.offset,
                y: t.y + Math.sin(angle+da) * this.offset}

            ctx.lineTo(pointA.x + (pointB.x - pointA.x)/2, pointA.y + (pointB.y - pointA.y)/2)

            ctx.moveTo(pointA.x , pointA.y)
            ctx.lineTo(t.x, t.y)
            ctx.lineTo(pointB.x, pointB.y)
            ctx.lineTo(pointA.x , pointA.y)

            if(this.style.fillStyle != null){
                ctx.fill()
            }
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }
    }

    return link
}

export {Link, FoldLink, CurveLink, ArrowsLink, ArrowsFoldLink}