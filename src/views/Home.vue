<template>
    <my-page title="拓扑图">
        <div class="layout-tool">
            <div>
                <!-- <label><input type="radio" name="type">默认</label> -->
                <!-- <label><input type="radio" name="type">框选</label> -->
                <!-- <label><input type="radio" name="type">加线</label> -->
                <!-- <button>居中显示</button> -->
                <!-- <button>全屏显示</button> -->
                <!-- <button>放大</button> -->
                <!-- <button>缩小</button> -->
                <!-- <label>
                    <input type="checkbox">鼠标缩放</label> -->

                <!-- <input v-model="keyword"> -->
                <!-- <ui-raised-button class="btn" label="查询" @click="search"/> -->
                <!-- <button>旋转克隆</button> -->
                <!-- <button>导出 PDF</button> -->
                <ui-raised-button class="btn" label="导出 PNG" @click="downloadPng"/>
                <!-- <ui-raised-button class="btn" label="添加用例" @click="addCase"/> -->
                <ui-raised-button class="btn" label="帮助" to="/help" target="_blank"/>
                
                <ui-raised-button class="btn" label="清空" @click="clear" />
                <ui-raised-button class="btn" label="选择模板" @click="templateBoxVisible = true" />
                <ui-raised-button class="btn" label="显示属性面板" @click="attrBoxVisible = true" />
                <ui-raised-button class="btn" label="显示类型面板" @click="typeBoxVisible = true" />
                
            </div>
        </div>
        <div class="layout-content">
            <canvas id="canvas" style="" width="800" height="500"></canvas>
        </div>
        <div id="app" class="layout-side">
            <!-- <button @click="node">Mode</button> -->
            <!-- <button @click="star">star</button> -->
            <!-- <button @click="star2">star2</button> -->
            <!-- <button @click="link">link</button> -->
            <!-- <button @click="uml">UML</button> -->
            <!-- <button @click="tree">tree</button> -->
            <!-- <button @click="device">device</button> -->
            <!-- <button @click="container">container</button> -->
            <!-- <button @click="container1">container1</button> -->
            
            <!-- <hr>
            随机生成1万个节点、5000条连线：
            <button @click="testing">性能测试（100节点）</button>
            用时：0.656 秒.

            <button @click="exportJson">导出 JSON</button>
            <button @click="loadJson">加载 JSON</button>
            
            <code>
        <pre>{
[]
}</pre>
            </code> -->

        </div>
        <ui-drawer class="type-box" :open="typeBoxVisible" left>
            <ui-appbar title="快速添加">
                <ui-icon-button icon="close" slot="left" @click="typeBoxVisible = false" />
            </ui-appbar>
            <div class="body">
                <div class="btn-group">
                    <ui-icon-button 
                        :class="{active: mode === 'select' }"
                        @click="setMode('select')"
                        icon=":icon icon-pointer" title="选择工具" />
                    <ui-icon-button :class="{active: mode === 'rect' }"
                        @click="setMode('rect')"
                        icon=":icon icon-rect" title="矩形" />
                    <ui-icon-button :class="{active: mode === 'round' }"
                        @click="setMode('round')"
                        icon=":icon icon-round" title="圆" />
                    <ui-icon-button :class="{active: mode === 'line' }"
                        @click="setMode('line')"
                        icon=":icon icon-line" title="直线" />
                    <br>
                    <ui-icon-button :class="{active: mode === 'join' }"
                        @click="setMode('join')"
                        icon=":icon icon-line" title="连线" />
                </div>
                <ul class="type-list">
                    <li class="item" v-for="img in images" @click="insertImage(img)">
                        <img class="img" :src="img">
                    </li>
                </ul>
            </div>
        </ui-drawer>
        <ui-drawer class="attr-box" :open="attrBoxVisible" right>
            <ui-appbar title="属性设置">
                <ui-icon-button icon="close" slot="left" @click="attrBoxVisible = false" />
            </ui-appbar>
            <div class="body" v-if="box.selectedElements">
                <div>（{{ curPosition.x }}，{{ curPosition.y }}）</div>
                <div v-if="box.selectedElements.length">
                    <ui-raised-button class="btn" label="删除节点" @click="remove" />
                </div>
                <div v-if="currElement">
                    <!-- <ui-raised-button class="btn" label="添加子节点" @click="addChildNode" /> -->
                    <input type="color" v-model="currElement.style.fillStyle">
                    <ui-text-field v-model="currElement.name" label="节点名称" />
                    <!-- <ui-text-field v-model.number="currElement.alpha" label="不透明度" /> -->
                    <ui-text-field type="number" v-model.number="currElement.width" label="宽度" />
                    <ui-text-field type="number" v-model.number="currElement.height" label="高度" />
                    <!-- {{ currElement }} -->
                </div>
                <div v-if="box.selectedElements.length">
                    <h2>操作</h2>
                    <ui-raised-button class="btn" label="左对齐" @click="alignLft" />
                    <ui-raised-button class="btn" label="水平居中" @click="alignCenter" />
                    <ui-raised-button class="btn" label="右对齐" @click="alignRight" />
                    <br>
                    <ui-raised-button class="btn" label="上对齐" @click="alignTop" />
                    <ui-raised-button class="btn" label="垂直居中" @click="alignMiddle" />
                    <ui-raised-button class="btn" label="下对齐" @click="alignBottom" />
                </div>
                <div v-if="!box.selectedElements.length">
                    请选择节点进行编辑
                    <br>
                    <div>填充色</div>
                    <input type="color" v-model="box.defaultStyle.fillColor">
                    <div v-if="box.defaultStyle.fillColor === 'transparent'">透明</div>
                    <button @click="box.defaultStyle.fillColor = 'transparent'">设为透明</button>
                    <br>
                    <div>线条颜色</div>
                    <input type="color" v-model="box.defaultStyle.strokeColor">
                    <br>
                    <div>线条宽度</div>
                    <input type="number" v-model.number="box.defaultStyle.strokeWidth">
                    <br>
                    <div>虚线值（0 则为实线）</div>
                    <input type="number" v-model.number="box.defaultStyle.strokeDash">
                </div>
            </div>
        </ui-drawer>
        <div class="template-box" v-if="templateBoxVisible">
            <ui-appbar title="模板">
                <ui-icon-button icon="close" slot="left" @click="templateBoxVisible = false" />
            </ui-appbar> 
            <div class="empty-box">
                <img class="img" src="/static/img/empty.svg">
                <div class="text">暂无模板</div>
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import '@/js/main'
    import DataBox from '@/js/databox'
    import plugins from '@/js/plugin/index'
    
    export default {
        data() {
            return {
                keyword: '',
                curPosition: {
                    x: 0,
                    y: 0
                },
                box: {},
                images: [
                    '/static/img/cloud.png',
                    '/static/img/laptop.png',
                    '/static/img/home.png',
                    '/static/img/building.png',
                    '/static/img/host.png',
                    '/static/img/printer.png',
                ],
                mode: '',
                currElement: null,
                attrBoxVisible: true,
                typeBoxVisible: true,
                templateBoxVisible: false
            }
        },
        mounted() {
            var box = new DataBox('dataBox', document.getElementById('canvas'))
            this.box = box
            this.box.isShowRange = false;
            this.box.image = null
            this.box.addPlugins(plugins)
            this.setMode('select')
            this.box.autoUpdate()

            this.box.subscribe('mousemove', e => {
                this.curPosition = {
                    x: e.x,
                    y: e.y
                }
            })
            this.box.subscribe('mouseup', e => {
                console.log('up')
                this.currElement = this.box.currElement
            })

//            //box.viewbox()
//            //box.setBg('');
//
//            var node = new Topo.Node('Hello world!');
//            node.setLocation(0, 0);
//            box.add(node);
//
//            var defaultNode = new Topo.Node('Node');
//            defaultNode.setLocation(200, 100);
//            defaultNode.rotate = Math.PI/10;
//            box.add(defaultNode);
//
//            var tipNode = new Topo.TipNode('a tip.');
//            tipNode.setLocation(540, 100);
//            box.add(tipNode);
//
//            var textNode = new Topo.TextNode('This is a Text node.');
//            textNode.setLocation(317, 310);
//            box.add(textNode);
//
//            var peopleNode = new Topo.Node('people');
//            peopleNode.setLocation(500, 200);
//            peopleNode.setSize(64, 64);
//            peopleNode.setImage('/static/img/person.png');
//            box.add(peopleNode);
//
//            var circleNode = new Topo.CircleNode()
//            circleNode.style.fillStyle = '0, 0, 255';
//            circleNode.setLocation(390, 90);
//            box.add(circleNode);
//
//            var heartNode = new Topo.HeartNode();
//            heartNode.style.fillStyle = '255, 0, 0';
//            heartNode.setLocation(300, 170);
//            box.add(heartNode);
//
//            var group = new Topo.GhomboidContainer("vmgroup");
//            group.style = {fillStyle: '0, 0, 100'};
//            group.add(circleNode);
//            group.add(heartNode);
//

//
//            hostNode.layout = {type: 'star', radius:160};
//            box.layoutNode(hostNode);

            /*group.add(node1);
             group.add(node2);*/

            this.init()
            this.addCase()
        },
        destroyed() {
            this.box.destroy()
        },
        methods: {
            init() {
            },
            addChildNode() {
                if (!this.box.currElement) {
                    alert('请选择节点')
                    return
                }
                let node = new Topo.Node()
                node.setImage('/static/img/laptop.png')
                node.setSize(64, 64)
                node.name = '未命名'
                node.setLocation(this.box.currElement.x + 100, this.box.currElement.y)
                this.box.add(node)
                this.box.add(new Topo.Link(this.box.currElement, node))
            },
            setMode(mode) {
                this.mode = mode
                this.box.mode = mode
            },
            rect() {
                var hostNode = new Topo.Rect()
                hostNode.setSize(64, 64)
                hostNode.setLocation(0, 0)
                this.box.add(hostNode);
            },
            downloadPng() {
                this.box.canvas.toBlob(function (blob) {
                    saveAs(blob, "pretty image.png")
                })
            },
            insertImage(img) {
                var node = new Topo.Node()
                node.setImage(img)
                node.setSize(64, 64)
                node.setLocation(0, 0)
                this.box.add(node)
            },
            addCase() {
                var hostNode = new Topo.Node();
                hostNode.setImage('/static/img/cloud.png');
                hostNode.setSize(64, 64);
                hostNode.setLocation(360, 190);
                hostNode.name = 'AAA'
                this.box.add(hostNode);

                var node = new Topo.Node();
                node.setImage('/static/img/laptop.png');
                node.setSize(64, 64);
                node.setLocation(200, 100)
                node.name = 'BBB'
                this.box.add(node);

                let link = new Topo.Link({
                    node: hostNode,
                    x: 0,
                    y: 0.5
                }, {
                    node: node,
                    x: 1,
                    y: 0.5
                })
                link.name = '哈哈'
                this.box.add(link)
            },
            search() {
                this.box.search(this.keyword)
            },
            exportJson() {
                console.log(this.box.getJson())
            },
            loadJson() {
                let json = '{"version":"1.0","title":"测试文件"}'
                this.box.loadJson(json)
            },
            testing() {
                var start = new Date().getTime();
                for (var i = 0; i < 1000; i++) {
                    var node = new Topo.Node();
                    node.x = Math.random() * box.width;
                    node.y = Math.random() * box.height;
                    box.add(node);

                    var node2 = new Topo.Node();
                    node2.x = Math.random() * box.width;
                    node2.y = Math.random() * box.height;
                    box.add(node2);

                    box.add(new Topo.Link(node, node2));
                }

                var time = new Date().getTime() - start;
                console.log(time + 'ms');
            },
            remove() {
                this.box.removeSelectedElement()
            },
            clear() {
                this.box.clear()
            },
            container1() {
                function HostNode(name) {
                    var node = new Topo.Node(name);
                    node.setType('host');
                    return node;
                }
                function VmNode(name) {
                    var node = new Topo.Node(name);
                    node.setType('vm');
                    return node;
                }

                var nodeA = null;
                (function () {
                    var node0 = new Topo.GhomboidNode('vm_0');
                    node0.setLocation(34, 181);
                    box.add(node0);

                    var node1 = new Topo.GhomboidNode('vm_1');
                    node1.setLocation(244, 191);
                    box.add(node1);
                    nodeA = node1;

                    var node2 = new Topo.GhomboidNode('vm_2');
                    node2.setLocation(281, 94);
                    box.add(node2);

                    var group = new Topo.GhomboidContainer("vmgroup");
                    group.style = { fillStyle: '0, 100, 0' };
                    group.add(node0);
                    group.add(node1);
                    group.add(node2);

                    box.add(group);
                })();

                (function () {
                    var node0 = new Topo.GhomboidNode('vm_0');
                    node0.setLocation(11, 393);
                    box.add(node0);

                    var node1 = new Topo.GhomboidNode('vm_1');
                    node1.setLocation(213, 292);
                    box.add(node1);

                    var node2 = new Topo.GhomboidNode('vm_2');
                    node2.setLocation(285, 345);
                    box.add(node2);

                    var group = new Topo.GhomboidContainer("vmgroup");
                    group.style = { fillStyle: '0, 0, 100' };
                    group.add(node0);
                    group.add(node1);
                    group.add(node2);

                    box.add(new Topo.FoldLink(nodeA, node1));

                    box.add(group);
                })();
            },
            container() {
                (function () {
                    var text1 = new Topo.TextNode('Shelf-1');
                    text1.setLocation(190, 300);
                    box.add(text1);

                    var text1 = new Topo.TextNode('Shelf-2');
                    text1.setLocation(390, 300);
                    box.add(text1);

                    var text1 = new Topo.TextNode('Shelf-2');
                    text1.setLocation(590, 300);
                    box.add(text1);

                    function GravityNode(name) {
                        var node = new Topo.Node(name);
                        node.inContainer = function (target) {
                            return true;
                        };
                        node.outContainer = function (target) {
                            return true;
                        };
                        return node;
                    }
                    var node0 = new Topo.Node('node');
                    node0.setType('host');
                    box.add(node0);

                    for (var i = 0; i < 20; i++) {
                        var node = new GravityNode('node' + i);
                        node.x = 400 + Math.random() * 50;
                        node.y = 320 + Math.random() * 50;
                        if (Math.random() > 0.5) {
                            node.setType('host');
                        } else {
                            node.setType('vm');
                            node.x -= 100;
                        }
                        box.add(node);
                    }

                    var group = new Topo.GridContainer("hostgroup");
                    group.x = 150;group.y = 100;
                    box.add(group);

                    var group = new Topo.GridContainer("hostgroup");
                    group.x = 350;group.y = 100;
                    group.add(node0);
                    box.add(group);

                    var group = new Topo.GridContainer("hostgroup2");
                    group.x = 550;group.y = 150;
                    group.rows = 2;group.cols = 4;
                    group.style = { fillStyle: '255, 200, 254' };
                    box.add(group);
                })();
            },
            device() {
                box.image.src = '/static/img/room.jpg';

                for (var i = 0; i < 5; i++) {
                    var pcNode = new Topo.Node('pc');
                    pcNode.setImage('/static/img/acer-samll.jpg');
                    pcNode.width = 65;
                    pcNode.height = 124;
                    pcNode.setLocation(200 + i * 100, 500);
                    box.add(pcNode);
                }

                var vmNode = new Topo.Node();
                vmNode.setImage('/static/img/vm_inner.jpg');
                vmNode.width = 900;
                vmNode.height = 600;
                vmNode.setLocation(100, 2000);
                box.add(vmNode);

                setTimeout(function () {
                    vmNode.setLocation(100, 2000);
                }, 500);

                box.subscribe('mouseup', function (e) {
                    if (e.target && e.target != vmNode) {
                        vmNode.visible = true;
                        vmNode.setLocation(100, 50);
                    } else {
                        vmNode.visible = false;
                        vmNode.setLocation(100, 2000);
                    }
                });
            },
            alignLft() {
                // this.box.currElement.x = 0
                for (let elem of this.box.selectedElements) {
                    elem.x = 0
                }
            },
            alignCenter() {
                // this.box.currElement.x = (this.box.width - this.box.currElement.width) / 2
                for (let elem of this.box.selectedElements) {
                    elem.x = (this.box.width - elem.width) / 2
                }
            },
            alignRight() {
                for (let elem of this.box.selectedElements) {
                    elem.x = this.box.width - elem.width
                }
                // this.box.currElement.x = this.box.width - this.box.currElement.width
            },
            alignTop() {
                for (let elem of this.box.selectedElements) {
                    elem.y = 0
                }
                // this.box.currElement.y = 0
            },
            alignMiddle() {
                // this.box.currElement.y = (this.box.height - this.box.currElement.height) / 2
                for (let elem of this.box.selectedElements) {
                    elem.y = (this.box.height - elem.height) / 2
                }
            },
            alignBottom() {
                // this.box.currElement.y = this.box.height - this.box.currElement.height
                for (let elem of this.box.selectedElements) {
                    elem.y = this.box.height - elem.height
                }
            },
            tree: function tree() {
                var hostNode = new Topo.Node();
                hostNode.setLocation(360, 190);
                this.box.add(hostNode);

                for (var i = 1; i < 6; i++) {
                    var node = new Topo.Node();
                    this.box.add(node);
                    this.box.add(new Topo.Link(hostNode, node));
                }

                //direction:'right top
                hostNode.layout = { type: 'tree', width: 140, height: 90, direction: 'bottom' };
                this.box.layoutNode(hostNode);
            },
            uml: function uml() {
                var User = {
                    id: 1,
                    name: 'jack', address: [],
                    getName: function getName() {}, setName: function setName() {}
                };

                var userNode = new Topo.UMLClassNode('User');
                userNode.classObj = User;
                userNode.setLocation(377, 77);
                this.box.addElement(userNode);

                var accountNode = new Topo.UMLClassNode('Account');
                accountNode.operations = ['+ add(user) :Integer', '+ getUsers :List'];
                accountNode.attributes = ['- id :String', '+ users :List'];
                accountNode.setLocation(92, 221);
                this.box.addElement(accountNode);

                var resourceNode = new Topo.UMLClassNode('Resource');
                resourceNode.operations = [];
                resourceNode.attributes = ['- id :String', '+ accounts :List', '+ type :String'];
                resourceNode.setLocation(381, 351);
                this.box.addElement(resourceNode);

                this.box.addElement(new Topo.ArrowsFoldLink(userNode, accountNode));
                this.box.addElement(new Topo.ArrowsLink(userNode, resourceNode));
            },
            link: function link() {
                (function () {
                    var nodeA = new Topo.Node('NodeA');
                    nodeA.setType('host');
                    nodeA.setLocation(300, 100);
                    box.add(nodeA);

                    var nodeB = new Topo.Node('NodeB');
                    nodeB.setType('host');
                    nodeB.setLocation(130, 200);
                    box.add(nodeB);

                    var link = new Topo.CurveLink(nodeA, nodeB);
                    box.add(link);
                })();

                (function () {
                    var nodeA = new Topo.CircleNode();
                    nodeA.setType('host');
                    nodeA.setLocation(50, 420);
                    box.add(nodeA);

                    var nodeB = new Topo.CircleNode();
                    nodeB.setLocation(300, 420);
                    box.add(nodeB);

                    var link = new Topo.Link(nodeA, nodeB);
                    box.add(link);
                })();

                (function () {
                    var nodeD = new Topo.Node('NodeD');
                    nodeD.setType('host');
                    nodeD.setLocation(350, 210);
                    box.add(nodeD);

                    var nodeE = new Topo.Node('NodeE');
                    nodeE.setType('zone');
                    nodeE.setLocation(470, 100);
                    box.add(nodeE);

                    var nodeC = new Topo.Node('NodeC');
                    nodeC.setType('host');
                    nodeC.setLocation(540, 300);
                    box.add(nodeC);

                    var nodeH = new Topo.Node('NodeG');
                    nodeH.setType('host');
                    nodeH.setLocation(540, 400);
                    box.add(nodeH);

                    var nodeG = new Topo.Node('NodeH');
                    nodeG.setType('host');
                    nodeG.setLocation(350, 360);
                    box.add(nodeG);

                    var link = new Topo.FoldLink(nodeD, nodeE);
                    box.add(link);

                    var link2 = new Topo.FoldLink(nodeE, nodeC);
                    link2.fold = 'y';
                    box.add(link2);

                    var link3 = new Topo.FoldLink(nodeE, nodeG);
                    link3.fold = 'y';
                    box.add(link3);

                    var link4 = new Topo.FoldLink(nodeE, nodeH);
                    link4.fold = 'y';
                    box.add(link4);
                })();
            },
            node: function node() {
                var defaultNode = new Topo.Node('Node');
                defaultNode.setLocation(200, 100);
                defaultNode.rotate = Math.PI / 10;
                box.add(defaultNode);

                var tipNode = new Topo.TipNode('a tip.');
                tipNode.setLocation(540, 100);
                box.add(tipNode);

                var textNode = new Topo.TextNode('This is a Text node.');
                textNode.setLocation(317, 310);
                _node.style.fontSize = '16pt';
                box.add(textNode);

                var peopleNode = new Topo.Node('people');
                peopleNode.setLocation(500, 200);
                peopleNode.setSize(64, 64);
                peopleNode.setImage('/static/img/person.png');
                box.add(peopleNode);

                var circleNode = new Topo.CircleNode();
                circleNode.style.fillStyle = '0, 0, 255';
                circleNode.setLocation(390, 90);
                box.add(circleNode);

                var heartNode = new Topo.HeartNode();
                heartNode.style.fillStyle = '255, 0, 0';
                heartNode.setLocation(300, 170);
                box.add(heartNode);

                var group = new Topo.GhomboidContainer("vmgroup");
                group.style = { fillStyle: '0, 0, 100' };
                group.add(peopleNode);
                group.add(defaultNode);
            },
            star2: function star2() {
                var cNode = new Topo.Node();
                cNode.setLocation(360, 100);
                cNode.setImage('/static/img/cloud.png');
                cNode.setSize(64, 64);
                cNode.layout = { type: 'star', radius: 250, beginDegree: 0, endDegree: Math.PI };
                box.add(cNode);

                var images = ['telephone.png', 'email.png', 'print.png', 'OS_Windows_8.png', 'OS_Ubuntu.png'];
                for (var i = 0; i < images.length; i++) {
                    var node = new Topo.Node();
                    node.setImage('/static/img/' + images[i]);
                    node.setSize(128, 128);
                    box.add(node);

                    var link = new Topo.Link(cNode, node);
                    box.add(link);
                }

                box.layoutNode(cNode);
            },

            star: function star() {

                var hostNode = new Topo.Node();
                hostNode.setImage('/static/img/cloud.png');
                hostNode.setSize(64, 64);
                hostNode.setLocation(360, 190);
                box.add(hostNode);

                for (var i = 0; i < 8; i++) {
                    var node = new Topo.Node();
                    node.setImage('/static/img/laptop.png');
                    node.setSize(64, 64);
                    box.add(node);
                    box.add(new Topo.Link(hostNode, node));
                }

                hostNode.layout = { type: 'star', radius: 160 };
                box.layoutNode(hostNode);
            }
        }
    }
</script>

<style scoped>
    .asd {
        cursor: crosshair
    }
</style>
