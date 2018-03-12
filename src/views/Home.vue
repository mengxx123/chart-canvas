<template>
    <div :padding="false">
        <ui-appbar title="拓扑图">
            <ui-icon-button icon="menu" slot="left"/>
        </ui-appbar>
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

                <input v-model="keyword">
                <ui-raised-button class="btn" label="查询" @click="search"/>
                <!-- <button>旋转克隆</button> -->
                <!-- <button>导出 PDF</button> -->
                <ui-raised-button class="btn" label="导出 PNG" @click="downloadPng"/>
                <ui-raised-button class="btn" label="添加用例" @click="addCase"/>
                <ui-raised-button class="btn" label="帮助" to="/help" target="_blank"/>
                <ui-raised-button class="btn" label="选择工具" @click="setMode('select')" />
                <ui-raised-button class="btn" label="画矩形" @click="setMode('rect')" />
                <ui-raised-button class="btn" label="画圆" @click="setMode('round')" />
                <ui-raised-button class="btn" label="画直线" @click="setMode('line')" />
            </div>
        </div>
        <div class="layout-body">
            <div class="layout-content">
                <canvas id="canvas" style="" width="800" height="500"></canvas>
            </div>
            <div id="app" class="layout-side">
                <button @click="node">Mode</button>
                <button @click="star">star</button>
                <button @click="star2">star2</button>
                <button @click="link">link</button>
                <button @click="uml">UML</button>
                <button @click="tree">tree</button>
                <button @click="device">device</button>
                <button @click="container">container</button>
                <button @click="container1">container1</button>
                <button @click="clear">清空</button>
                <button @click="remove">删除</button>
                <hr>
                随机生成1万个节点、5000条连线：
                <button @click="testing">性能测试（100节点）</button>
                用时：0.656 秒.

                <button @click="exportJson">导出 JSON</button>
                <button @click="loadJson">加载 JSON</button>
                <div>（{{ curPosition.x }}，{{ curPosition.y }}）</div>
                <code>
            <pre>{
    []
}</pre>
                </code>

            </div>
        </div>
    </div>
</template>

<script>
    import '@/js/main'
    import DataBox from '@/js/databox'
    
    export default {
        data() {
            return {
                keyword: '',
                curPosition: {
                    x: 0,
                    y: 0
                }
            }
        },
        mounted() {
            var box = new DataBox('dataBox', $("#canvas")[0]);
            this.box = box
            this.box.isShowRange = false;
            this.box.image = null
            this.setMode('line')

            var node = new Topo.Circle()
            node.r = 100
            node.setLocation(0, 0)
            this.box.add(node)

            this.box.subscribe('mousemove', e => {
                this.curPosition = {
                    x: e.dx,
                    y: e.dy
                }
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
            box.updateView();
        },
        methods: {
            init() {

            },
            setMode(mode) {
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
            addCase() {
                var hostNode = new Topo.Node();
                hostNode.setImage('/static/img/cloud.png');
                hostNode.setSize(64, 64);
                hostNode.setLocation(360,190);
                this.box.add(hostNode);

                var node = new Topo.Node();
                node.setImage('/static/img/laptop.png');
                node.setSize(64, 64);
                node.setLocation(200, 100)
                this.box.add(node);
                this.box.add(new Topo.Link(hostNode, node));
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
            testing: function testing() {
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

                box.updateView();

                var time = new Date().getTime() - start;
                console.log(time + 'ms');
            },
            remove() {
                this.box.removeSelectedElement()
            },
            clear: function clear() {
                this.box.clear()
                this.box.updateView()
            },
            container1: function container1() {
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
            container: function container() {
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
            device: function device() {
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

                box.updateView();

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

                this.box.updateView();
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

                this.box.updateView();
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

                box.updateView();
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

</style>
