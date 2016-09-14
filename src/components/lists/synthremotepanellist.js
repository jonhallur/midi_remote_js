import { Component } from 'jumpsuit'
import { deleteSynthRemotePanel} from '../../state/synthremotes'
import {DragSource, DropTarget} from 'react-dnd'

const ItemTypes = {
  PANELROW: 'panelrow'
};

const rowSource = {
  beginDrag(props) {
    return {
      field_id: props.field_id,
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
    let source = props.field_id
    let target = monitor.getItem().field_id
    if (source === 'undefined' || target === 'undefined')
    {
      return;
    }
  }
};


const SynthPanelRow = Component({
    deleteField(event) {
        event.preventDefault();
        var id = event.target.id;
        deleteSynthRemotePanel(this.props.params.key, id);
        //deleteSysexheaderfield(this.props.params.key, id);
    },

    render() {
      const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        return connectDragSource(connectDropTarget(
            <tr >
                <td>
                    {this.props.panel.name}
                </td>
                <td>
                    <a id={this.props.field_id} href="#" onClick={this.deleteField}><span id={this.props.field_id} className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>
                </td>
            </tr>
        ))
    }
});/**
 * Created by jonhallur on 07/09/16.
 */

const TargetSynthPanelRow = DropTarget(ItemTypes.PANELROW, rowTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(SynthPanelRow);

const SourceTargetSynthPanelRow = DragSource(ItemTypes.PANELROW, rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(TargetSynthPanelRow);


export default Component({
  render () {
    let params = this.props.params;
    let panels = this.props.panels;
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
          return <SourceTargetSynthPanelRow params={params} field_id={index} key={index} panel={panel}/>
        })}
        </tbody>
      </table>

    )
  }
}, (state) => ({
  panels: state.synthremotes.synthremote.panels
}))
