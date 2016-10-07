import { Component } from 'jumpsuit'
import {swapSysexheaderfields, deleteSysexheaderfield} from '../../state/sysexheaders'
import {DragSource, DropTarget} from 'react-dnd'
import {ITEMTYPE} from '../../pojos/constants'

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
      let source = props.field_id;
      let target = monitor.getItem().field_id;
      if (source === undefined || target === undefined)
      {
        return;
      }
      swapSysexheaderfields(component.props.params.key, source, target);
  }
};


const SysExHeaderFieldRow = Component({
  deleteField(event) {
    event.preventDefault();
    var id = event.target.id;
    deleteSysexheaderfield(this.props.params.key, id);
  },

  render() {
    const { connectDragSource, connectDropTarget, isOver } = this.props;
    return connectDragSource(connectDropTarget(
      <tr className={isOver ? 'active': ''}>
        <td>
          {this.props.field.name}
        </td>
        <td>
          {this.props.field.value}{this.props.field.channel_mod ? " + Channel Number" : ""}
        </td>
        <td>
          <a id={this.props.field_id} href="#" onClick={this.deleteField}>
            <span id={this.props.field_id} className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
          </a>
        </td>
      </tr>
    ))
  }
});

const TargetSysexheaderFieldRow = DropTarget(ITEMTYPE.LISTROW, rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(SysExHeaderFieldRow);

const SourceTargetSysexheaderFieldRow = DragSource(ITEMTYPE.LISTROW, rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(TargetSysexheaderFieldRow);

export default Component({
    render () {
        var params = this.props.params;
        return (
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Name</th>
                <th>Value/Modifier</th>
                <th>Remove</th>
              </tr>
              </thead>
              <tbody>
              {this.props.fields.map(function (field, index) {
                return <SourceTargetSysexheaderFieldRow params={params} field_id={index} key={index} field={field}/>
              })}
              </tbody>
            </table>
          )
    }
}, (state) => ({
    fields: state.sysexheaders.sysexheader.fields
}))


