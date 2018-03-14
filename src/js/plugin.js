/* eslint-disable */
let plugins = [
    // 矩形插件
    {
        name: 'rect',
        onMousemove(box, x, y) {
            if (box.isOnMouseDown) {
                box.updateView()
                box.ctx.fillStyle = box.defaultStyle.fill
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
            var node = new Topo.Rect()
            node.setSize(width, height)
            node.setLocation(minX, minY)
            node.style.fillStyle = box.defaultStyle.fill
            node.style.strokeStyle = '#666'
            box.add(node)
            box.updateView()
            box.mode = 'common'
        }
    },
    // 直线插件
    {
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
    },
    // 圆形插件
    {
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
    }
]

export default plugins
