import Element from './element'
/* eslint-disable */
class Container extends Element {
    
    constructor(name) {
        super()

        this.name = name
        this.x = 0
        this.y = 0
        this.width = 40
        this.height = 40
        this.items = []
        this.style = {fillStyle: '193, 200, 254'}
        this.alpha = 0.3
        this.dragable = true
    }

    add(e) {
        this.items.push(e)
        e.parentContainer = this
    }

    remove(e) {
        for(var i=0; i<this.items.length; i++){
            if(this.items[i] === e){
                e.parentContainer = null
                this.items = this.items.del(i)
                e.lastParentContainer = this
                break
            }
        }
    }

    removeAll() {
        for(var i=0; i<this.items.length; i++){
            this.remove(this.items[i])
        }
    }

    setLocation(x , y){
        var dx = x - this.x
        var dy = y - this.y
        this.x = x
        this.y = y

        for(var i=0; i<this.items.length; i++){
            var item = this.items[i]
            item.setLocation(item.x + dx, item.y + dy)
        }
    }

    updateBound() {
        var bound = {x: 10000000, y:1000000, width:0, height:0}
        if(this.items.length > 0){
            var minX = 10000000
            var maxX = -10000000
            var minY = 10000000
            var maxY = -10000000
            var width = maxX - minX
            var height = maxY - minY
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i]
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

            this.x = minX - 5
            this.y = minY - 5
            this.width = width + 5
            this.height = height + 5
        }
    }

    draw(ctx) {
        this.updateBound()
        ctx.save()
        ctx.beginPath()
        ctx.shadowBlur = 9
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3
        ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.closePath()
        ctx.restore()
    }


}

function GhomboidContainer(){
    var container = new Container()
    container.offset = 50
    container.draw = function(ctx){
        this.updateBound()
        ctx.save()
        ctx.beginPath()
        ctx.shadowBlur = 9
        ctx.shadowColor = 'rgba(0,0,0,0.9)'
        ctx.shadowOffsetX = 6
        ctx.shadowOffsetY = 6
        ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')'
        ctx.moveTo(this.x+this.offset, this.y)
        ctx.lineTo(this.x+this.offset+this.width, this.y)
        ctx.lineTo(this.x+this.width, this.y+this.height)
        ctx.lineTo(this.x, this.y+this.height)
        ctx.lineTo(this.x+this.offset, this.y)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
    return container
}

function GridContainer(){
    var container = new Container()
    container.rows = 3
    container.cols = 2
    container.cellWidth = 60
    container.cellHeight = 60
    container.offset = 3
    //container.padding = {left:0, right:0, top:0, bottom:0}

    container.adjustLayout = function(){
        for(var i=0; i<this.items.length; i++){
            var item = this.items[i]
            var row = Math.floor(i / this.cols)
            var col = i % this.cols
            item.x = this.x + col * container.cellWidth
            item.y = this.y + row * container.cellHeight
        }
    }

    container.add = function(e){
        var capacity = this.items.length
        if(capacity == this.rows * this.cols) return
        this.items.push(e)
        e.parentContainer = this
        this.adjustLayout()
    }

    container.draw = function(ctx){
        container.width = container.cols * container.cellWidth
        container.height = container.rows * container.cellHeight
        ctx.save()
        ctx.beginPath()
        ctx.shadowBlur = 12
        ctx.shadowColor = 'rgba(0,0,0,0.9)'
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 3
        ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')'

        var r = 0
        if(container.isFocus()){
            r = this.offset
            ctx.shadowColor = 'rgba(0,0,200, 1)'
            ctx.fillRect(this.x-r, this.y-r, this.width+r*2, this.height+r*2)
        }else{
            ctx.shadowColor = 'rgba(0,0,0,0.5)'
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
		/*
		 ctx.moveTo(this.x-r, this.y -r)
		 ctx.lineTo(this.x-r + 10, this.y - 10 -r)
		 ctx.lineTo(this.x-r + 10 + this.width, this.y - 10-r)
		 ctx.lineTo(this.x-r + 10 + this.width, this.y + this.height - 10 -r)
		 ctx.lineTo(this.x-r + this.width, this.y + this.height -r)

		 ctx.moveTo(this.x-r + 10 + this.width, this.y - 10 -r)
		 ctx.lineTo(this.x-r + this.width, this.y -r)

		 for(var i=0; i<=this.rows; i++){
		 for(var j=0; j<this.cols; j++){
		 ctx.moveTo(this.x-r, this.y + i * this.cellHeight - r)
		 ctx.lineTo(this.x-r+this.width, this.y+ i * this.cellHeight-r)
		 }
		 }
		 for(var i=0; i<=this.rows; i++){
		 for(var j=0; j<=this.cols; j++){
		 ctx.moveTo(this.x-r + j * this.cellWidth, this.y + r)
		 ctx.lineTo(this.x-r + j * this.cellWidth, this.y+ i * this.cellHeight - r)
		 }
		 }*/

        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
    return container
}

function OneItemContainer(){
    var container = new GridContainer()
    container.rows = 1
    container.cols = 1
    container.cellWidth = 50
    container.cellHeight = 50

    container.dragable = false

    container.style.fillStyle = '0,100,100'
    container.alpha = 0.5

    return container
}

export {Container, GridContainer, OneItemContainer, GhomboidContainer}