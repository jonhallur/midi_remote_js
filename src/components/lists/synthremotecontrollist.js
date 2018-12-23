import {Component} from 'jumpsuit'
import {getControls} from '../../state/midicontrols'
import {ITEMTYPE, SUBCONTROLTYPE} from '../../pojos/constants'
import {DragSource, DropTarget} from 'react-dnd'
import {swapCollectionItemsByIndex, removeFromCollectionByIndex} from "../../state/genericfirebase";

const rowSource = {
  beginDrag(props) {
    return {
      control_id: props.control_id,
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
      return {
        dropOnSelf: true
      }
    }
    else {
      return {
        dropOnSelf: false
      }
    }
  },

  canDrop(props, monitor, component) {
    const dragIndex = monitor.getItem().control_id;
    const hoverIndex = props.control_id;
    return dragIndex !== hoverIndex;
  },

  drop(props, monitor, component) {
    let source_index = props.control_id;
    let target_index = monitor.getItem().control_id;
    if (source_index === undefined || target_index === undefined)
    {
      return;
    }
    let {remote_id, panel_id} = component.props.params;
    let pathList = ['admin/synthremotes', remote_id, 'panels', panel_id, 'controls'];
    swapCollectionItemsByIndex(pathList, source_index, target_index);
  }
};


const MidiControlRow = Component({
  render() {
    const { connectDragSource, connectDropTarget, isOver, canDrop } = this.props;
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin/synthremotes', remote_id, 'panels', panel_id, 'controls'];
    let listGroupColoring = 'list-group-item';
    if (isOver) {
      if (canDrop) {
        listGroupColoring = 'list-group-item-info list-group-item'
      }
      else {
        listGroupColoring = 'disabled list-group-item'
      }
    }
    let extraInfo = '';
    if (this.props.control.subtype === SUBCONTROLTYPE.RANGE.toString() || this.props.control.subtype === SUBCONTROLTYPE.NOTERANGE.toString()) {
      let stringList = [" - From:", this.props.control.minimum, "to:", this.props.control.maximum, "- Default:", this.props.control.default];
      extraInfo = stringList.join(' ');
    }
    else if (this.props.control.subtype === SUBCONTROLTYPE.TOGGLE.toString()) {
      extraInfo = " - Toggle, Default: " + (this.props.control.default ? 'On' : 'Off');
    }
    else if (this.props.control.subtype === SUBCONTROLTYPE.LIST.toString()) {
      extraInfo = " - List, Length: " + this.props.control.options.length;
    }
    return connectDragSource(connectDropTarget(
      <div className={listGroupColoring}>
        <strong>{this.props.control.name}</strong> - #{this.props.control.parameter}&nbsp;
        {extraInfo}
          <a
            className="badge"
            id={this.props.control_id}
            href="#"
            onClick={(event) => removeFromCollectionByIndex(pathList, event.target.id)}
          >
            <span id={this.props.control_id} className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
          </a>
      </div>
    ))
  }
});

const TargetMidiControlRow = DropTarget(ITEMTYPE.LISTROW, rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }))(MidiControlRow);

const SourceTargetMidiControlRow = DragSource(ITEMTYPE.LISTROW, rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(TargetMidiControlRow);




export default Component({
  componentDidMount() {
    let {remote_id, panel_id} = this.props.params;
    getControls(remote_id, panel_id);
  },

  render() {
    return (
      <div className="list-group">
        {this.props.controls.map((control, index) => (
          <SourceTargetMidiControlRow
            key={index}
            params={this.props.params}
            control_id={index}
            control={control}
          />
        ))}
      </div>
    )
  }
}, (state) => ({
  controls: state.midicontrols.controls,
}))