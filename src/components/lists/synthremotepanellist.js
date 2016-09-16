import { Component } from 'jumpsuit'
import { deleteSynthRemotePanel, swapSynthRemotePanels} from '../../state/synthremotes'
import {DragSource, DropTarget} from 'react-dnd'

const ItemTypes = {
  PANELROW: 'panelrow'
};

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
    let source = props.panel_id;
    let target = monitor.getItem().panel_id;
    if (source === undefined || target === undefined)
    {
      return;
    }
    swapSynthRemotePanels(component.props.params.key, source, target);
  }
};


const SynthPanelRow = Component({
    deleteField(event) {
        event.preventDefault();
        var id = event.target.id;
        deleteSynthRemotePanel(this.props.params.key, id);
    },

    render() {
        const { connectDragSource, connectDropTarget, isOver } = this.props;
        let href='/admin/synthremote/' + this.props.params.key + '/panel/edit/' + this.props.panel_id;
        return connectDragSource(connectDropTarget(
            <tr className={isOver ? 'warning' : ''}>
                <td>
                    <a href={href}>{this.props.panel.name}</a>
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

const TargetSynthPanelRow = DropTarget(ItemTypes.PANELROW, rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))(SynthPanelRow);

const SourceTargetSynthPanelRow = DragSource(ItemTypes.PANELROW, rowSource, (connect, monitor) => ({
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
