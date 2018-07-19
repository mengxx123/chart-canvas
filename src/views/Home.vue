<template>
    <my-page title="拓扑图">
        <div class="layout-type">
            <ui-sub-header class="sub-header">常用</ui-sub-header>
            <ul class="mode-list">
                <li class="item"
                    :class="{active: mode === 'select' }"
                    @click="setMode('select')"
                    title="选择工具">
                    <i class="icon icon-pointer"></i>
                </li>
                <li class="item"
                    @click="insertText"
                    title="插入文本">
                    <i class="icon icon-text"></i>
                </li>
                <li class="item"
                    :class="{active: mode === 'join' }"
                    @click="setMode('join')"
                    title="连线">
                    <i class="icon icon-line"></i>
                </li>
            </ul>
            <ui-sub-header class="sub-header">画图</ui-sub-header>
            <ul class="mode-list">
                <li class="item"
                    :class="{active: mode === 'rect' }"
                    @click="setMode('rect')"
                    title="矩形">
                    <i class="icon icon-rect"></i>
                </li>
                <li class="item"
                    :class="{active: mode === 'ellipse' }"
                    @click="setMode('ellipse')"
                    title="椭圆">
                    <i class="icon icon-round"></i>
                </li>
                <!-- <li class="item"
                    :class="{active: mode === 'round' }"
                    @click="setMode('round')"
                    title="圆">
                    <i class="icon icon-round"></i>
                </li> -->
                <li class="item"
                    :class="{active: mode === 'line' }"
                    @click="setMode('line')"
                    title="直线">
                    <i class="icon icon-line"></i>
                </li>
            </ul>
            <ui-sub-header class="sub-header">图标</ui-sub-header>
            <ul class="type-list">
                <li class="item" v-for="item in paths" :title="item.name" @click="insertPath(item.path)">
                    <svg viewBox="0 0 48 48" width="48" height="48">
                        <path :d="item.path" fill="#555" />
                    </svg>
                </li>
                <li class="item">
                    <ui-icon class="more" value="more_vert" />
                </li>
            </ul>
            <ui-sub-header class="sub-header">图片</ui-sub-header>
            <ul class="type-list">
                <li class="item" v-for="img in images" @click="insertImage(img)">
                    <img class="img" :src="img">
                </li>
            </ul>
        </div>
        <div class="layout-tool">
            <div class="content">
                
                <!-- <button>居中显示</button> -->
                <!-- <button>全屏显示</button> -->
                <!-- <button>放大</button> -->
                <!-- <button>缩小</button> -->
                <!-- <label>
                    <input type="checkbox">鼠标缩放</label> -->

                <!-- <button>旋转克隆</button> -->
                <!-- <button>导出 PDF</button> -->
                <my-menu title="文件">
                    <ui-menu class="header-menu" slot="menu">
                        <ui-menu-item title="新建" @click="clear" />
                        <ui-menu-item title="导出 PNG" @click="downloadPng" />
                    </ui-menu>
                </my-menu>
                <my-menu title="查看">
                    <ui-menu class="header-menu" slot="menu">
                        <ui-menu-item title="搜索框"
                            :leftIcon="searchVisible? 'check' : ''"
                            :inset="!searchVisible"
                            @click="searchVisible = !searchVisible" />
                        <ui-menu-item title="标尺"
                            :leftIcon="rulerVisible? 'check' : ''"
                            :inset="!rulerVisible"
                            @click="rulerVisible = !rulerVisible" />     
                        <ui-menu-item title="网格"
                            :leftIcon="showGrid? 'check' : ''"
                            :inset="!showGrid"
                            @click="showGrid = !showGrid" />    
                    </ui-menu>
                </my-menu>
                <my-menu title="插入">
                    <ui-menu class="header-menu" slot="menu">
                        <ui-menu-item title="文本" @click="insertText" />
                        <ui-menu-item title="图片" @click="uploadImage" />
                        <ui-menu-item title="模板" @click="templateBoxVisible = true" />
                    </ui-menu>
                </my-menu>
                <my-menu title="帮助">
                    <ui-menu class="header-menu" slot="menu">
                        <ui-menu-item title="帮助文档" @click="help" />
                    </ui-menu>
                </my-menu>

                <!-- <ui-raised-button class="btn" label="添加用例" @click="addCase"/> -->
                
                <!-- <ui-raised-button class="btn" label="显示属性面板" @click="attrBoxVisible = true" /> -->
                <!-- <ui-raised-button class="btn" label="切换类型面板" @click="typeBoxVisible = !typeBoxVisible" /> -->
                <!-- <ui-raised-button class="float-button" icon="file_upload" title="上传图片">
                    <ui-icon value="file_upload" />
                </ui-raised-button> -->
                <input id="file" type="file" class="ui-file-button" multiple="multiple" accept="image/*" @change="fileChange($event)" style="display: none">
            </div>
        </div>
        <div class="layout-content">
            <div id="editor-box" class="editor-box">
                <div class="x-axis" v-if="rulerVisible">
                    <canvas id="x-canvas"></canvas>
                    <div class="point" :style="{left: (offsetX + curPosition.x - 1) + 'px'}"></div>
                </div>
                <div class="y-axis" v-if="rulerVisible">
                    <canvas id="y-canvas"></canvas>
                    <div class="point" :style="{top: (offsetY + curPosition.y - 1) + 'px'}"></div>
                </div>
                <div class="axis-o" v-if="rulerVisible"></div>
                <div class="editor-wrap">
                    <div id="editor" class="editor" @contextmenu="onContextmenu($event)">
                        <svg id="svg" class="svg" width="800" height="500" style="">
                            <path id="path" d="M250 150 L150 350 L350 350 Z" />
                        </svg>
                        <canvas id="canvas-bg" class="canvas canvas-bg" width="800" height="500"></canvas>
                        <canvas id="canvas" class="canvas" width="800" height="500"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div id="app" class="layout-side">
            <ui-tabs class="tab-head" :value="activeTab" @change="handleTabChange">
                <ui-tab value="attr" title="属性"/>
                <ui-tab value="layer" title="图层"/>
                <ui-tab value="design" title="排版"/>
                <ui-tab value="doc" title="文档"/>
            </ui-tabs>
            <div class="ui-tab-content" v-if="activeTab === 'attr'">
                <div class="body" v-if="box.selectedElements">
                    <!-- <div>
                        {{ box.selectedElements.length }}
                    </div> -->
                    <!-- <div>（{{ curPosition.x }}，{{ curPosition.y }}）</div> -->
                    <div v-if="currElement && box.selectedElements.length === 1">
                        <!-- <ui-raised-button class="btn" label="添加子节点" @click="addChildNode" /> -->
                        <div class="form-title">填充色</div>
                        <color-picker v-model="currElement.style.fillColor" />

                        <div class="form-title">线条色</div>
                        <color-picker class="fl margin-right" v-model="currElement.style.strokeColor" />
                        <ui-text-field class="input-xs margin-right" type="number" v-model.number="currElement.style.strokeWidth" label="线条宽度" />
                        <ui-text-field class="input-xs" type="number" v-model.number="currElement.style.strokeDash" label="虚线值（0 则为实线）" />

                        <ui-text-field v-model="currElement.name" label="节点名称" />
                        <br>
                        <ui-checkbox v-model="currElement.drawName" label="绘制节点名称" />
                        <br>
                        <ui-text-field v-model="currElement.text" label="文本" />
                        <div class="form-title">文本颜色</div>
                        <color-picker v-model="currElement.style.textColor" />
                        <ui-text-field v-model.number="currElement.style.textSize" type="number" label="文本大小" />
                        <!-- <ui-text-field v-model.number="currElement.alpha" label="不透明度" /> -->
                        <ui-text-field class="input-sm margin-right" type="number" v-model.number="currElement.x" label="X" />
                        <ui-text-field class="input-sm margin-right" type="number" v-model.number="currElement.y" label="Y" />
                        <br>
                        <ui-text-field class="input-sm margin-right" type="number" v-model.number="currElement.width" label="宽度" />
                        <ui-text-field class="input-sm" type="number" v-model.number="currElement.height" label="高度" />
                        <!-- {{ currElement }} -->
                    </div>
                    <div v-if="box.selectedElements.length > 1">
                        <!-- <ui-raised-button class="btn" label="添加子节点" @click="addChildNode" /> -->
                        <div class="form-title">填充色</div>
                        <color-picker v-model="options.fillColor" />

                        <div class="form-title">线条色</div>
                        <color-picker class="fl margin-right" v-model="options.strokeColor" />
                        <ui-text-field class="input-xs margin-right" type="number" v-model.number="options.strokeWidth" label="线条宽度" />
                        <ui-text-field class="input-xs" type="number" v-model.number="options.strokeDash" label="虚线值（0 则为实线）" />
                    </div>
                    <div v-if="!box.selectedElements.length">
                        <!-- 请选择节点进行编辑 -->
                        <div class="form-title">填充色</div>
                        <color-picker v-model="box.defaultStyle.fillColor" />
                        <br>
                        <div class="form-title">线条颜色</div>
                        <color-picker v-model="box.defaultStyle.strokeColor" />
                        <br>
                        <ui-text-field type="number" v-model.number="box.defaultStyle.strokeWidth" label="线条宽度" />
                        <br>
                        <ui-text-field type="number" v-model.number="box.defaultStyle.strokeDash" label="虚线值（0 则为实线）" />
                    </div>
                </div>
            </div>
            <div class="ui-tab-content" v-if="activeTab === 'layer'">
                <div class="layer-empty" v-if="!layers.length">暂无形状</div>
                <ul class="layer-list">
                    <li class="item"
                        :class="layerItemClass(item)"
                        v-for="item in layers">
                        <div class="visible" @click="toggleElemVisible(item)">
                            <ui-icon class="ic-visible" value="visibility" v-if="item.visible" title="可见" />
                            <ui-icon class="ic-invisible" value="visibility_off" v-else title="不可见" />
                        </div>
                        <div class="lock" @click="toggleElemLock(item)">
                            <ui-icon class="ic-lock" value="lock" v-if="item.lock" title="锁定" />
                            <ui-icon class="ic-unlock" value="lock_open" v-else />
                        </div>
                        <div class="type" @click="selectLayerItem(item)">
                            <i class="mu-icon icon icon-line" v-if="item.type === 'line'" title="直线"></i>
                            <i class="mu-icon icon icon-rect" v-else-if="item.type === 'rect'" title="矩形"></i>
                            <i class="mu-icon icon icon-round" v-else-if="item.type === 'circle'" title="圆"></i>
                            <i class="mu-icon icon icon-round" v-else-if="item.type === 'ellipse'" title="椭圆"></i>
                            <!-- <i class="mu-icon icon icon-meiyan" v-else-if="item.type === 'image'" title="图片"></i> -->
                            <i class="mu-icon icon icon-line" v-else-if="item.type === 'link'" title="连接线"></i>
                            <i class="mu-icon icon icon-text" v-else-if="item.type === 'text'" title="文本"></i>
                            <svg class="svg" viewBox="0 0 48 48" width="48" height="48" v-else-if="item.type === 'path'">
                                <path :d="item.path"
                                    :fill="item.style.fillColor"
                                    :stroke="item.style.strokeColor"
                                    :stroke-width="item.style.strokeWidth"
                                     />
                            </svg>
                            <img class="image" :src="item.image"
                                v-else-if="item.type === 'image'" title="图片">
                            <span v-else>{{ item.type }}</span>
                        </div>
                        <div class="name">
                            <input class="input" v-model="item.name" placeholder="未命名">
                            <!-- {{ item.name || '未命名'}} -->
                        </div>
                        <!-- <div class="name">{{ item.id }}</div> -->
                        <ui-icon-menu
                            class="op"
                            icon="more_vert"
                            :anchorOrigin="leftTop"
                            :targetOrigin="leftTop"
                            @click.stop="noNothing()"
                            >
                            <ui-menu-item title="删除" @click.stop="removeLayerItem(item)" />
                        </ui-icon-menu>
                        <!-- <button class="op" @click.stop="removeLayerItem(item)">删除</button> -->
                    </li>
                </ul>
                <!-- <ui-icon-button class="search-btn" icon="search" /> -->
                <div class="search-box" v-if="searchVisible">
                    <input class="input" v-model="keyword" placeholder="输入节点名称搜索" />
                    <!-- <ui-icon-button class="icon" icon="close" /> -->
                    <ui-icon-button class="icon" icon="search" @click="search" />
                </div>
            </div>
            <div class="ui-tab-content" v-if="activeTab === 'design'">
                <div class="body">
                    <div v-if="box.selectedElements && box.selectedElements.length">
                        <h2>操作</h2>
                        <ui-icon-button class="btn" icon="format_align_left" @click="alignLft" title="左对齐" />
                        <ui-icon-button class="btn" icon="format_align_center" @click="alignCenter" title="水平居中" />
                        <ui-icon-button class="btn" icon="format_align_right" @click="alignRight" title="右对齐" />
                        <br>
                        <ui-icon-button class="btn" icon="vertical_align_top" @click="alignTop" title="顶部对齐" />
                        <ui-icon-button class="btn" icon="vertical_align_center" @click="alignMiddle" title="垂直居中" />
                        <ui-icon-button class="btn" icon="vertical_align_bottom" @click="alignBottom" title="底部对齐" />
                        <!-- <ui-raised-button class="btn" label="左对齐" @click="alignLft" />
                        <ui-raised-button class="btn" label="水平居中" @click="alignCenter" />
                        <ui-raised-button class="btn" label="右对齐" @click="alignRight" /> -->
                        <br>
                        <div class="form-item">
                            <ui-text-field class="input" v-model.number="widthScale" type="number" label="缩放比例" />
                            <ui-flat-button class="btn" label="宽度对齐" @click="alignWidth" />
                        </div>
                        <div class="form-item">
                            <ui-text-field class="input" v-model.number="heightScale" type="number" label="缩放比例" />
                            <ui-flat-button class="btn" label="高度对齐" @click="alignHeight" />
                        </div>
                        <div class="form-item">
                            <ui-text-field class="input" v-model.number="elemOffsetX" type="number" label="水平间距" />
                            <ui-flat-button class="btn" label="调整" @click="alignOffsetX" />
                        </div>
                        <div class="form-item">
                            <ui-text-field class="input" v-model.number="elemOffsetX2" type="number" label="水平位置" />
                            <ui-flat-button class="btn" label="调整" @click="alignOffsetX2" />
                        </div>
                        <div class="form-item">
                            <ui-text-field class="input" v-model.number="elemOffsetY" type="number" label="垂直间距" />
                            <ui-flat-button class="btn" label="调整" @click="alignOffsetY" /> 
                        </div>
                        <div class="form-item">
                            <ui-text-field class="input" v-model.number="elemOffsetY2" type="number" label="垂直位置" />
                            <ui-flat-button class="btn" label="调整" @click="alignOffsetY2" />                        <!-- <ui-raised-button class="btn" label="垂直居中" @click="alignMiddle" /> -->
                        </div>
                    </div>
                    <div v-else>请选择形状进行编辑</div>
                </div>
            </div>
            <div class="ui-tab-content" v-if="activeTab === 'doc'">
                <div class="body">
                    <ui-checkbox label="显示网格" v-model="showGrid" />
                    <br>
                    <ui-select-field v-model="gridType" label="网格类型">
                        <ui-menu-item :value="1" title="普通"/>
                        <ui-menu-item :value="2" title="图标"/>
                    </ui-select-field>
                    <!-- <ui-text-field v-model.number="doc.gridSize" type="number" label="网格大小" />
                    <br> -->
                    <ui-text-field v-model="doc.name" label="文件名" />
                    <br>
                    <ui-text-field v-model.number="doc.width" type="number" label="宽度" />
                    <br>
                    <ui-text-field v-model.number="doc.height" type="number" label="高度" />
                    <br>
                    <ui-raised-button label="调整文档大小" primary @click="resetDocSize" />
                </div>
            </div>
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
        <ui-menu class="elem-menu"
            :style="{top: contextMenu.y + 'px', left: contextMenu.x + 'px'}"
            v-if="contextMenu.visible">
            <ui-menu-item title="粘贴" @click="pasteElem"/>
        </ui-menu>
        <ui-menu class="elem-menu"
            ref="elemContextMenu"
            :style="{top: elemContextMenu.y + 'px', left: elemContextMenu.x + 'px'}"
            v-if="elemContextMenu.visible">
            <ui-menu-item title="剪切" @click="cutElem"/>
            <ui-menu-item title="复制" @click="copyElem"/>
            <ui-menu-item title="快速复制" @click="quickCopyElem"/>
            <ui-divider />
            <ui-menu-item title="置于顶层" @click="moveIndexTop"/>
            <ui-menu-item title="上移一层" @click="moveIndexUp"/>
            <ui-menu-item title="下移一层" @click="moveIndexDown"/>
            <ui-menu-item title="置于底层" @click="moveIndexBottom"/>
        </ui-menu>
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
                doc: {
                    name: '未命名',
                    width: 480,
                    height: 480,
                    gridSize: 20
                },
                rulerVisible: false,
                offsetX: 0,
                offsetY: 0,
                showGrid: true,
                gridType: 1,
                activeTab: 'attr',
                options: {
                    fillColor: null,
                    strokeColor: null,
                    strokeWidth: 1,
                    strokeDash: 0
                },
                searchVisible: true,
                paths: [
                    {
                        name: '',
                        path: 'M45.4 37.9L27.1 19.6c1.8-4.6.8-10.1-2.9-13.8-4-4-10-4.8-14.8-2.5l8.7 8.7-6.1 6.1-8.7-8.7C1 14.2 1.8 20.2 5.8 24.2c3.7 3.7 9.2 4.7 13.8 2.9l18.3 18.3c.8.8 2.1.8 2.8 0l4.7-4.7c.8-.7.8-2 0-2.8z'
                    },
                    {
                        name: '',
                        path: 'M24 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm18 14H30v26h-4V32h-4v12h-4V18H6v-4h36v4z'
                    },
                    {
                        name: '',
                        path: 'M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'
                    },
                    {
                        name: '',
                        path: 'M44 24l-8-8v6H6v4h30v6z'
                    },
                    {
                        name: '',
                        path: 'M18 32.34L9.66 24l-2.83 2.83L18 38l24-24-2.83-2.83z'
                    },
                    {
                        name: '矩形',
                        path: 'M45.667,37.5H2.5V10h43.167V37.5z'
                    },
                    {
                        name: '正方形',
                        path: 'M44.5,44h-40V4h40V44z'
                    },
                    {
                        name: '椭圆',
                        path: 'M44.333,24.5c0,7.824-9.178,14.167-20.5,14.167c-11.321,0-20.5-6.343-20.5-14.167c0-7.824,9.178-14.167,20.5-14.167C35.155,10.333,44.333,16.676,44.333,24.5z'
                    },
                    {
                        name: '圆形',
                        path: 'M44.667,24.25c0,11.552-9.365,20.917-20.917,20.917S2.833,35.802,2.833,24.25S12.198,3.333,23.75,3.333S44.667,12.698,44.667,24.25z'
                    },
                    {
                        name: '三角形',
                        path: 'M41.667,42.834H5.833L24,7L41.667,42.834z'
                    },
                    {
                        name: '直角三角形',
                        path: 'M4.567,38.53h39.886L4.567,8.616V38.53z'
                    },
                    {
                        name: '五边形',
                        path: 'M23.86,3L2,18.882l8.35,25.699h27.019l8.35-25.699L23.86,3z'
                    },
                    {
                        name: '六边形',
                        path: 'M33.664,7.192H13.999l-9.832,17.03l9.832,17.033h19.665L43.5,24.223L33.664,7.192z'
                    },
                    {
                        name: '菱形',
                        path: 'M24.694,40.02l20.473-15.354L24.694,9.313L4.224,24.666L24.694,40.02z'
                    },
                    {
                        name: '十字架',
                        path: 'M4.833,26.962h16.788V43.75h5.925V26.962h16.787v-5.925H27.547V4.249h-5.925v16.788H4.833V26.962z'
                    },
                    {
                        name: '八边形',
                        path: 'M32.922,4.021H16.37L4.667,15.724v16.552L16.37,43.979h16.552l11.703-11.703V15.724L32.922,4.021z'
                    },
                    {
                        name: '四角星',
                        path: 'M24,5.323l5.828,13.593l13.594,5.829l-13.594,5.824L24,44.167l-5.829-13.598L4.578,24.745l13.593-5.829L24,5.323z'
                    },
                    {
                        name: '五角星',
                        path: 'M24,4.667l4.75,15.25l15.972-0.195L31.686,28.95l5.12,15.131L24,34.53l-12.805,9.551l5.118-15.131L3.278,19.721l15.972,0.195L24,4.667z'
                    },
                    {
                        name: '圆角矩形',
                        path: 'M7.955,38.928h32.781c2.263,0,4.098-1.834,4.098-4.097c0-0.001,0-0.001,0-0.002V12.29c-0.001-2.262-1.835-4.095-4.098-4.095H7.955c-2.262,0-4.097,1.833-4.098,4.095v22.539c0,2.263,1.834,4.099,4.097,4.099C7.954,38.928,7.955,38.928,7.955,38.928z'
                    },
                    {
                        name: '框架',
                        path: 'M3.278,8.333v31.04h41.389V8.333H3.278z M41.561,36.267H6.381V11.436h35.18V36.267z'
                    },
                    {
                        name: '环',
                        path: 'M23.818,3.593c-11.331,0-20.517,9.186-20.517,20.517c0,11.331,9.186,20.517,20.517,20.517s20.516-9.186,20.516-20.517C44.334,12.779,35.149,3.593,23.818,3.593z M23.818,32.317c-4.533,0-8.208-3.675-8.208-8.208s3.674-8.208,8.208-8.208c4.532,0,8.208,3.674,8.208,8.208S28.351,32.317,23.818,32.317z'
                    },
                    {
                        name: '箭头',
                        path: 'M3.241,24.002l6.389-6.388v3.194h35.128v3.194v3.188H9.63v3.194L3.241,24.002z'
                    },
                    {
                        name: '现代箭头',
                        path: 'M2.721,24.801L18.21,9.312l3.649,3.648l-9.253,9.259H45v5.162H12.605l9.253,9.254L18.21,40.29L2.721,24.801z'
                    },
                    {
                        name: '用例',
                        path: 'M23.929,17.578c11.822,0,21.405,2.875,21.405,6.422s-9.583,6.422-21.405,6.422c-11.822,0-21.406-2.875-21.406-6.422S12.107,17.578,23.929,17.578z'
                    },
                    {
                        name: '参与者',
                        path: 'M18.177,44.334V24.123v8.086h-3.877V16.041l1.938-2.019h15.518l1.944,2.019v16.168h-3.884v-8.086v20.211H24V28.166v16.168H18.177z M28.038,7.96c0.047-2.233-1.724-4.08-3.955-4.127c-2.232-0.048-4.079,1.722-4.126,3.954c-0.001,0.058-0.001,0.115,0,0.173c-0.048,2.23,1.723,4.079,3.954,4.126c2.232,0.048,4.08-1.723,4.127-3.955C28.039,8.075,28.039,8.017,28.038,7.96z'
                    }
                    // {
                    //     name: '',
                    //     path: ''
                    // },
                ],
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
                attrBoxVisible: false,
                typeBoxVisible: false,
                templateBoxVisible: false,
                widthScale: 1,
                heightScale: 1,
                elemOffsetX: 0,
                elemOffsetX2: 0,
                elemOffsetY: 0,
                elemOffsetY2: 0,
                contextMenu: {
                    visible: false,
                    x: 10,
                    y: 10
                },
                elemContextMenu: {
                    visible: false,
                    x: 10,
                    y: 10
                }
            }
        },
        computed: {
            layers() {
                if (!this.box.nodes) {
                    return []
                }
                return this.box.nodes.reverse()
                // return this.box.nodes
            }
        },
        mounted() {
            this.resetDocSize()
            let canvas = document.getElementById('canvas')
            var box = new DataBox('dataBox', canvas)
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
                this.currElement = this.box.currElement
            })
            this.box.subscribe('cursor', e => {
                canvas.style.cursor = e.cursor
            })

            this.debug()

            this.init()
            this.addCase()
        },
        destroyed() {
            this.box.destroy()
        },
        methods: {
            init() {
            },
            insertText() {
                let text = new Topo.Text()
                text.text = '123'
                text.x = 100
                text.y = 100
                text.width = 200
                text.height = 100
                this.box.add(text)
            },
            insertPath(p) {
                let path = new Topo.Path()
                path.path = p
                path.x = 100
                path.y = 100
                let max = Math.max(path.width, path.height)
                if (max < 200) {
                    let scale = 200 / max
                    path.width *= scale 
                    path.height *= scale 
                }
                path.style.fillColor = '#000'
                path.style.strokeColor = null
                this.box.add(path)
            },
            debug() {
                let box = this.box

                // let text = new Topo.Text()
                // text.text = '123'
                // text.x = 100
                // text.y = 100
                // text.width = 200
                // text.height = 100
                // box.add(text)

                // let circle = new Topo.Circle()
                // circle.x = 100
                // circle.y = 100
                // circle.width = 80
                // circle.style.fillColor = '#09c'
                // // circle.visible = false
                // // circle.lock = true
                // box.add(circle)

                // let path = new Topo.Path()
                // path.path = 'M220 120 L120 320 L320 320 Z'
                // path.x = 0
                // path.y = 0
                // console.log('path', path.width, path.height)
                // path.width = 60
                // path.height = 60
                // box.add(path)

                // let ellipse = new Topo.Ellipse()
                // ellipse.x = 200
                // ellipse.y = 200
                // ellipse.width = 200
                // ellipse.height = 100
                // box.add(ellipse)

                // let rect = new Topo.Rect()
                // // rect.name = '123'
                // rect.x = 0
                // rect.y = 0
                // rect.width = 200
                // rect.height = 100
                // box.add(rect)

                // let link = new Topo.Link({
                //     node: circle,
                //     x: 0.5,
                //     y: 1
                // }, {
                //     node: rect,
                //     x: 0.5,
                //     y: 0
                // })
                // box.add(link)

                // let link = new Topo.Link({
                //     x: 100,
                //     y: 100
                // }, {
                //     x: 200,
                //     y: 200
                // })
                // box.add(link)

                // let img = new Topo.Image()
                // img.x = 0
                // img.y = 0
                // img.width = 100
                // img.height = 100
                // img.image = '/static/img/laptop.png'
                // box.add(img)

                // let line = new Topo.Line()
                // line.x = 0
                // line.y = 200
                // line.x2 = 100
                // line.y2 = 300
                // box.add(line)


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
            },
            uploadImage() {
                document.getElementById('file').click()
            },
            resetDocSize() {
                document.getElementById('svg').style.width = this.doc.width + 'px'
                document.getElementById('svg').style.height = this.doc.height + 'px'
                document.getElementById('svg').setAttribute('width', this.doc.width)
                document.getElementById('svg').setAttribute('height', this.doc.height)
                document.getElementById('editor-box').style.width = (this.doc.width + 160) + 'px'
                document.getElementById('editor-box').style.height = (this.doc.height + 160) + 'px'
                document.getElementById('editor').style.width = this.doc.width + 'px'
                document.getElementById('editor').style.height = this.doc.height + 'px'
                let canvas = document.getElementById('canvas')
                canvas.style.width = this.doc.width + 'px'
                canvas.style.height = this.doc.height + 'px'
                canvas.width = this.doc.width
                canvas.height = this.doc.height
                let ctx = canvas.getContext('2d')
                ctx.width = this.doc.width
                ctx.height = this.doc.height
                
                canvas = document.getElementById('canvas-bg')
                canvas.style.width = this.doc.width + 'px'
                canvas.style.height = this.doc.height + 'px'
                ctx = canvas.getContext('2d')
                canvas.width = this.doc.width
                canvas.height = this.doc.height
                ctx.width = this.doc.width
                ctx.height = this.doc.height

                this.drawBg()
                this.drawRuler()
            },
            drawRuler() {
                if (!this.rulerVisible) {
                    return
                }
                let canvas = document.getElementById('x-canvas')
                canvas.style.width = 1200 + 'px'
                canvas.style.height = 24 + 'px'
                let ctx = canvas.getContext('2d')
                canvas.width = 1200
                canvas.height = 24
                ctx.width = 1200
                ctx.height = 24

                let offsetX = document.getElementById('canvas').getBoundingClientRect().x -
                    document.getElementById('editor-box').getBoundingClientRect().x
                this.offsetX = offsetX
                console.log(offsetX)
                // ctx.fillRect(offsetX, 0, 800, 24)
                for (let i = 0; i < this.doc.width * 2; i += 20) {
                    ctx.beginPath()
                    if (i % 100 === 0) {
                        ctx.strokeStyle = '#666'
                        ctx.moveTo(offsetX + i, 8)
                    } else {
                        ctx.moveTo(offsetX + i, 16)
                        ctx.strokeStyle = '#ccc'
                    }
                    ctx.lineTo(offsetX + i, 24)
                    ctx.stroke()
                    if (i % 100 === 0) {
                        ctx.fillText(i, offsetX + i + 4, 12)
                    }
                }

                canvas = document.getElementById('y-canvas')
                canvas.style.width = 24 + 'px'
                canvas.style.height = 1200 + 'px'
                ctx = canvas.getContext('2d')
                canvas.width = 24
                canvas.height = 1200
                ctx.width = 24
                ctx.height = 1200

                let offsetY = document.getElementById('canvas').getBoundingClientRect().y -
                    document.getElementById('editor-box').getBoundingClientRect().y
                this.offsetY = offsetY
                console.log(offsetX)
                // ctx.fillRect(offsetX, 0, 800, 24)
                for (let i = 0; i < this.doc.height * 2; i += 20) {
                    ctx.beginPath()
                    if (i % 100 === 0) {
                        ctx.strokeStyle = '#666'
                        ctx.moveTo(8, offsetY + i)
                    } else {
                        ctx.moveTo(16, offsetY + i)
                        ctx.strokeStyle = '#ccc'
                    }
                    ctx.lineTo(24, offsetY + i)
                    ctx.stroke()
                    if (i % 100 === 0) {
                        ctx.fillText(i, 4, offsetY + i + 12)
                    }
                }
            },
            drawBg() {
                let canvasBg = document.getElementById('canvas-bg')
                let ctxBg = canvasBg.getContext('2d')
                // ctxBg.fillRect(0, 0, 100, 100)
                ctxBg.clearRect(0, 0, this.doc.width, this.doc.height)
                if (!this.showGrid) {
                    return
                }
                if (this.gridType === 1) {
                    this.drawBgStyle1()
                } else {
                    this.drawBgStyle2()
                }
            },
            drawBgStyle1() {
                let canvasBg = document.getElementById('canvas-bg')
                let ctxBg = canvasBg.getContext('2d')
                // 竖线
                for (let i = 0; i < this.doc.width; i += 20) {
                    ctxBg.lineWidth = 0.5
                    if (i % 100 === 0) {
                        ctxBg.strokeStyle = '#999'
                    } else {
                        ctxBg.strokeStyle = '#ccc'
                    }
                    ctxBg.beginPath()
                    ctxBg.moveTo(i, 0 + 0.5)
                    ctxBg.lineTo(i, this.doc.height + 0.5)
                    ctxBg.stroke()
                }
                for (let i = 0; i < this.doc.height; i += 20) {
                    ctxBg.lineWidth = 0.5
                    if (i % 100 === 0) {
                        ctxBg.strokeStyle = '#999'
                    } else {
                        ctxBg.strokeStyle = '#ccc'
                    }
                    ctxBg.beginPath()
                    ctxBg.moveTo(0 + 0.5, i)
                    ctxBg.lineTo(this.doc.width + 0.5, i)
                    ctxBg.stroke()
                }
            },
            drawBgStyle2() {
                let canvasBg = document.getElementById('canvas-bg')
                let ctxBg = canvasBg.getContext('2d')
                let size = Math.min(this.doc.width, this.doc.height)
                // size = 400
                let startX = this.doc.width / 2 - size / 2
                let startY = this.doc.height / 2 - size / 2
                ctxBg.strokeStyle = '#ccc'
                // 框
                ctxBg.beginPath()
                ctxBg.rect(startX, startY, size, size)
                ctxBg.stroke()
                // 斜线
                ctxBg.beginPath()
                ctxBg.moveTo(startX, startY)
                ctxBg.lineTo(startX + size, startY + size)
                ctxBg.stroke()
                ctxBg.beginPath()
                ctxBg.moveTo(startX + size, startY)
                ctxBg.lineTo(startX, startY + size)
                ctxBg.stroke()
                // 大圆
                ctxBg.beginPath()
                ctxBg.arc(this.doc.width / 2, this.doc.height / 2, size * 22 / 48, 0, Math.PI * 2)
                ctxBg.stroke()
                // 小圆
                ctxBg.beginPath()
                ctxBg.arc(this.doc.width / 2, this.doc.height / 2, size * 10 / 48, 0, Math.PI * 2)
                ctxBg.stroke()
                // 方形
                ctxBg.beginPath()
                ctxBg.rect(startX + size * 5 / 48, startY + size * 5 / 48, size * 38 / 48, size * 38 / 48)
                ctxBg.stroke()
                // 水平方形
                ctxBg.beginPath()
                ctxBg.rect(startX + size * 2 / 48, startY + size * 8 / 48, size * 44 / 48, size * 32 / 48)
                ctxBg.stroke()
                // 竖直方形
                ctxBg.beginPath()
                ctxBg.rect(startX + size * 8 / 48, startY + size * 2 / 48, size * 32 / 48, size * 44 / 48)
                ctxBg.stroke()
                // 竖线
                let grid = size / 48
                for (let i = startX; i < startX + size; i += grid) {
                    ctxBg.lineWidth = 0.5
                    ctxBg.strokeStyle = '#ddd'
                    ctxBg.beginPath()
                    ctxBg.moveTo(i, startY + 0.5)
                    ctxBg.lineTo(i, startY + size + 0.5)
                    ctxBg.stroke()
                }
                for (let i = startY; i < startY + size; i += grid) {
                    ctxBg.lineWidth = 0.5
                    ctxBg.strokeStyle = '#ddd'
                    ctxBg.beginPath()
                    ctxBg.moveTo(startX + 0.5, i)
                    ctxBg.lineTo(startX + size + 0.5, i)
                    ctxBg.stroke()
                }
            },
            noNothing() {},
            handleTabChange(value) {
                this.activeTab = value
            },
            layerItemClass(item) {
                if (item.selected) {
                    return ['selected']
                }
                return []
            },
            onContextmenu(e) {
                e.preventDefault()
                if (this.box.selectedElements.length) {
                    this.elemContextMenu.visible = true
                    this.contextMenu.visible = false
                    this.elemContextMenu.x = e.pageX
                    this.elemContextMenu.y = e.pageY
                    this.$nextTick(() => {
                        let rect = this.$refs.elemContextMenu.getBoundingClientRect()
                        if (e.pageY + rect.height > window.innerHeight) {
                            this.elemContextMenu.y = window.innerHeight - rect.height - 16
                        }
                    })
                    let onClick
                    document.addEventListener('click', onClick = () => {
                        this.elemContextMenu.visible = false
                        document.removeEventListener('click', onClick)
                    })
                } else {
                    this.contextMenu.visible = true
                    this.elemContextMenu.visible = false
                    this.contextMenu.x = e.pageX
                    this.contextMenu.y = e.pageY
                    let onClick
                    document.addEventListener('click', onClick = () => {
                        this.contextMenu.visible = false
                        document.removeEventListener('click', onClick)
                    })
                }
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
                this.box.canvas.toBlob(blob => {
                    saveAs(blob, (this.doc.name || '未命名') + '.png')
                })
            },
            selectElem(node) {
                if (!node.visible) {
                    return
                }
                this.box.cancleAllSelected()
                node.selected = true
                this.box.currElement = node
                this.box.selectedElements = []
                this.box.selectedElements.push(node)
            },
            selectLayerItem(item) {
                this.selectElem(item) 
            },
            removeLayerItem(item) {
                this.box.remove(item)
            },
            insertImage(img) {
                var node = new Topo.Image()
                node.image = img
                node.setSize(64, 64)
                node.setLocation(100, 100)
                this.box.add(node)
                this.selectElem(node)
            },
            addCase() {
                var hostNode = new Topo.Node();
                hostNode.setImage('/static/img/cloud.png');
                hostNode.setSize(64, 64);
                hostNode.setLocation(360, 190);
                hostNode.name = 'AAA'
                // this.box.add(hostNode);

                var node = new Topo.Node();
                node.setImage('/static/img/laptop.png');
                node.setSize(64, 64);
                node.setLocation(200, 100)
                node.name = 'BBB'
                // this.box.add(node);

                let link = new Topo.Link({
                    node: hostNode,
                    x: 0,
                    y: 0.5
                }, {
                    node: node,
                    x: 1,
                    y: 0.5
                })
                // link.name = '哈哈'
                // this.box.add(link)
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
                this.box.alignLft()
            },
            alignCenter() {
                this.box.alignCenter()
            },
            alignRight() {
                this.box.alignRight()
            },
            alignTop() {
                this.box.alignTop()
            },
            alignMiddle() {
                this.box.alignMiddle()
            },
            alignBottom() {
                this.box.alignBottom()
            },
            alignWidth() {
                this.box.alignWidth(this.widthScale)
            },
            alignHeight() {
                this.box.alignHeight(this.heightScale)
            },
            alignOffsetX() {
                this.box.alignOffsetX(this.elemOffsetX)
            },
            alignOffsetX2() {
                this.box.alignOffsetX2(this.elemOffsetX2)
            },
            alignOffsetY() {
                this.box.alignOffsetY(this.elemOffsetY)
            },
            alignOffsetY2() {
                console.log('啥')
                this.box.alignOffsetY2(this.elemOffsetY2)
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
            },
            fileChange(e) {
                let files = e.target.files
                if (!files.length) {
                    this.$message({
                        type: 'danger',
                        text: '请选择文件'
                    })
                    return
                }
                let reader = new FileReader()
                reader.onloadend = e => {
                    let img = new Image()
                    img.onload = () => {
                        let node = new Topo.Image()
                        node.image = e.target.result
                        let width = img.width
                        let height = img.height
                        if (width > 300) {
                            height = 300 * height / width
                            width = 300
                        }
                        if (height > 300) {
                            width = 300 * width / height
                            height = 300
                        }
                        node.setSize(width, height)
                        node.setLocation(0, 0)
                        this.box.add(node)
                        this.selectElem(node)
                    }
                    img.src = e.target.result
                }
                reader.readAsDataURL(files[0])
            },
            cutElem() {
                this.copedElem = this.box.currElement
                this.box.remove(this.copedElem)
            },
            copyElem() {
                this.copedElem = this.box.currElement
            },
            quickCopyElem() {
                this.copyElem()
                this.pasteElem()
            },
            moveIndexTop() {
                this.box.moveIndexTop()
            },
            moveIndexBottom() {
                this.box.moveIndexBottom()
            },
            moveIndexUp() {
                this.box.moveIndexUp()
            },
            moveIndexDown() {
                this.box.moveIndexDown()
            },
            pasteElem() {
                let newElem = this.deepCpy(this.copedElem, 0)
                newElem.id = new Date().getTime()
                newElem.x += 16
                newElem.y += 16
                console.log('添加了')
                this.box.add(newElem)
            },
            deepCpy(obj, index) {
                console.log('copy')
                // if (!obj) {
                //     return obj
                // }
                // if (index > 1) {
                //     return obj
                // }
                // let copy = new obj.constructor()
                // for (let attr in obj) {
                //     if (obj.hasOwnProperty(attr)) {
                //         copy[attr] = this.deepCpy(obj[attr], index + 1)
                //     }
                // }
                // return copy
                let ret = new obj.constructor()
                for (let key in obj) {
                    ret[key] = obj[key]
                }
                return ret
                // function isClass(o){
                //     if(o===null) return "Null";
                //     if(o===undefined) return "Undefined";
                //     return Object.prototype.toString.call(o).slice(8,-1);
                // }

                // var result={},oClass=isClass(obj);
                // for(let key in obj){
                //     var copy=obj[key];
                //     if(isClass(copy)=="Object"){
                //         result[key]=arguments.callee(copy);
                //     }else if(isClass(copy)=="Array"){
                //         result[key]=arguments.callee(copy);
                //     }else{
                //         result[key]=obj[key];
                //     }
                // }
                // return result;
            },
            help() {
                window.open('/help')
            },
            toggleElemVisible(item) {
                item.visible = !item.visible
            },
            toggleElemLock(item) {
                item.lock = !item.lock
            }
        },
        watch: {
            showGrid() {
                this.drawBg()
            },
            rulerVisible() {
                this.$nextTick(() => {
                    this.drawRuler()
                })
            },
            gridType() {
                this.drawBg()
            },
            options: {
                deep: true,
                handler(oldValue, newValue) {
                    if (oldValue.strokeWidth !== newValue.strokeWidth) {
                        alert(1)
                    }
                    for (let node of this.box.selectedElements) {
                        node.style.fillColor = this.options.fillColor
                        node.style.strokeColor = this.options.strokeColor
                    }
                }
                    // strokeWidth: 1,
                    // strokeDash: 0
            }
        }
    }
</script>

<style scoped>
    .asd {
        cursor: crosshair
    }
</style>
