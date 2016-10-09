import { Component } from 'jumpsuit'
import { deleteSynthRemotePanel, swapSynthRemotePanels} from '../../state/synthpanels'
import {removeFromCollectionByIndex, swapCollectionItemsByIndex} from '../../state/genericfirebase'
import {DragSource, DropTarget} from 'react-dnd'
import {ITEMTYPE} from '../../pojos/constants'


const rowSource = {
  beginDrag(props) {
    return {
      panel_id: props.panel_id,
      index: props.index
    }
  }
};

const rowTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
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
      const { connectDragSource, connectDropTarget, isOver } = this.props;
      let {remote_id} = this.props.params;
      let hrefList= ['/admin/synthremote', remote_id, 'panel/edit', this.props.panel_id ];
      console.log(this.props.panel);
      return connectDragSource(connectDropTarget(
        <tr className={isOver ? 'warning' : ''}>
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
});/**
 * Created by jonhallur on 07/09/16.
 */

const TargetSynthPanelRow = DropTarget(ITEMTYPE.LISTROW, rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))(SynthPanelRow);

const SourceTargetSynthPanelRow = DragSource(ITEMTYPE.LISTROW, rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(TargetSynthPanelRow);


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
