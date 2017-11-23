/**
 * Topo (17.6.1) element.js
 * Licensed under MIT
 */

import Element from './element'

class AbstractNode extends Element {
    constructor(name) {
        super()

        this.id = null
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        this.visible = true
        this.dragable = true

        this.name = name
        this.image = null
        this.color = null
        this.layout = null
        this.gravitate = null;//function(){}
        this.parentContainer = null
        this.inContainer = null
        this.outContainer = null
        this.fixed = false
    }



    getName() {
        return this.name
    }

    setName(n){
        this.name = n
        return this
    }

    getImage(){
        return this.image
    }

    setImage(i){
        var node = this
        if(typeof i == 'string'){
            var img = this.image = new Image()
            this.image.onload = function(){
                node.setSize(img.width, img.height)
            }
            this.image.src = i
        }else{
            this.image = i
        }
    }

    getTypeImage(type) {
        var typeImages = {
            'zone' : './img/zone.png',
            'host' : './img/host.png',
            'vm' : './img/vm.png'
        }
        if(AbstractNode.ImageCache[type]){
            return AbstractNode.ImageCache[type]
        }
        var src = typeImages[type]
        if(src == null) return null

        var image = new Image()
        image.src = src
        return AbstractNode.ImageCache[type] = image
    }

    getType() {
        return this.type
    }

    setType(type) {
        this.type = type
        this.setImage(this.getTypeImage(type))
    }
}

AbstractNode.ImageCache = {}

export default AbstractNode