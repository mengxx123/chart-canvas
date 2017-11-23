import DataBox from './databox'
import Element from './element'
import AbstractNode from './abstractnode'
import {Node, CircleNode, GhomboidNode, TipNode, TextNode, HeartNode, UMLClassNode, EndPointNode} from './node'
import {Container, GridContainer, OneItemContainer, GhomboidContainer} from './container'
import {Rect, Circle} from './rect'
import {Link, FoldLink, CurveLink, ArrowsLink, ArrowsFoldLink} from './link'

var Topo = {
    version: '0.3.0',
    Link: Link,
    FoldLink: FoldLink,
    CurveLink: CurveLink,
    ArrowsLink: ArrowsLink,
    ArrowsFoldLink: ArrowsFoldLink,
    Circle: Circle,
    Rect: Rect,
    DataBox: DataBox,
    Element: Element,
    AbstractNode: AbstractNode,
    Node: Node,
    CircleNode: CircleNode,
    GhomboidNode: GhomboidNode,
    TipNode: TipNode,
    TextNode: TextNode,
    HeartNode: HeartNode,
    UMLClassNode: UMLClassNode,
    EndPointNode: EndPointNode,
    Container: Container,
    GridContainer: GridContainer,
    OneItemContainer: OneItemContainer,
    GhomboidContainer: GhomboidContainer
}

window.Topo = Topo

export default Topo