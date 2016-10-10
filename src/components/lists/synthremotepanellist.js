import { Component } from 'jumpsuit'
import {removeFromCollectionByIndex, swapCollectionItemsByIndex} from '../../state/genericfirebase'
import {DragSource, DropTarget} from 'react-dnd'
import {ITEMTYPE} from '../../pojos/constants'

export default Component({
  render () {
    let params = this.props.params;
    return (
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Remove</th>
        </tr>
        </thead>
        <tbody>
        {this.props.panels.map(function (panel, index) {
          return <SourceTargetSynthPanelRow params={params} panel_id={index} key={index} panel={panel}/>
        })}
        </tbody>
      </table>
    )
  }
}, (state) => ({
  panels: state.synthremotes.synthremote.panels
}))

const rowSource = {
  beginDrag(props) {
    return {
      panel_id: props.panel_id,
      index: props.index
    }
  }
};

const rowTarget = {
  canDrop(props, monitor, component) {
    const dragIndex = monitor.getItem().panel_id;
    const hoverIndex = props.panel_id;
    return dragIndex !== hoverIndex;
  },

  drop(props, monitor, component) {
    let source_index = props.panel_id;
    let target_index = monitor.getItem().panel_id;
    if (source_index === undefined || target_index === undefined)
    {
      return;
    }
    let {remote_id} = props.params;
    let pathList = ['admin/synthremotes', remote_id, 'panels'];
    swapCollectionItemsByIndex(pathList, source_index, target_index);
    //swapSynthRemotePanels(component.props.params.remote_id, source_index, target_index);
  }
};


const SynthPanelRow = Component({
    deleteField(event) {
      event.preventDefault();
      //deleteSynthRemotePanel(this.props.params.remote_id, event.target.id);
      let {remote_id} = this.props.params;
      let pathList = ['admin/synthremotes', remote_id, 'panels'];
      removeFromCollectionByIndex(pathList, event.target.id)
    },

    render() {
      const { connectDragSource, connectDropTarget, isOver, canDrop } = this.props;
      let {remote_id} = this.props.params;
      let hrefList= ['/admin/synthremote', remote_id, 'panel/edit', this.props.panel_id ];
      let colorStyle = '';
      if(isOver) {
        if (canDrop) {
          colorStyle='info'
        }
        else {
          colorStyle='danger'
        }
      }
      return connectDragSource(connectDropTarget(
        <tr className={colorStyle}>
          <td>
            <a href={hrefList.join('/')}>
              {this.props.panel.name}
            </a> - # Controls: {this.props.panel['controls'] !== undefined ? this.props.panel.controls.length : 0}
          </td>
          <td>
            <a id={this.props.panel_id} href="#" onClick={this.deleteField}>
              <span id={this.props.panel_id} className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
            </a>
          </td>
        </tr>
      ))
    }
});

const TargetSynthPanelRow = DropTarget(ITEMTYPE.LISTROW, rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))(SynthPanelRow);

const SourceTargetSynthPanelRow = DragSource(ITEMTYPE.LISTROW, rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(TargetSynthPanelRow);

