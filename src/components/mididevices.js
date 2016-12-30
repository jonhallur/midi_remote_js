/**
 * Created by jonh on 17.10.2016.
 */
import mididevices, {initializeMidi} from '../state/mididevices'
import {saveLastUsedMidiDevice} from '../state/synthremotes'
import {Component} from 'jumpsuit'
import Selector from './input/arrayselector'
import TreeSelector from 'rc-tree-select'

export default Component({
  componentDidMount() {
    initializeMidi();
  },

  onMidiOutputSelected(value) {
    if (value === undefined) {
      return;
    }
    let [device, channel] = value.split(',');
    mididevices.setSelectedOutput(device);
    mididevices.setSelectedOutputChannel(channel);
    saveLastUsedMidiDevice(device, channel);
  },

  render() {
    let {outputs, selectedOutput, selectedOutputChannel} = this.props;
    let selectedDeviceChannel = selectedOutput && selectedOutputChannel ? outputs[selectedOutput].name + ' - Ch: ' + (selectedOutputChannel) : '';
    return (
      <form className="form-inline">
        <Selector
          label="In"
          default_text="Select Input"
          value={this.props.selectedInput}
          data={this.props.inputs} id="midi-inputs"
          eventhandler={event => mididevices.setSelectedInput(event.target.value)}
        />
        <Selector
          label=""
          default_text="Channel"
          value={this.props.selectedInputChannel}
          data={this.props.midiChannels}
          eventhandler={event => mididevices.setSelectedInputChannel(event.target.value)}
        />

        <TreeSelector
          style={{ width: 175 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          placeholder={<i>Select Midi Device</i>}
          treeData={this.props.outputMap}
          treeLine treeDefaultExpandAll
          showSearch={false}
          treeNodeFilterProp="label"
          filterTreeNode={true}
          treeDataSimpleMode={{id: 'key', rootPId: 0}}
          value={selectedDeviceChannel}
          onChange={this.onMidiOutputSelected}
        />
      </form>
    )
  }
}, (state) => ({
  inputs: state.mididevices.inputs,
  outputs: state.mididevices.outputs,
  selectedInput: state.mididevices.selectedInput,
  selectedOutput: state.mididevices.selectedOutput,
  midiChannels: state.mididevices.channels,
  selectedOutputChannel: state.mididevices.selectedOutputChannel,
  selectedInputChannel: state.mididevices.selectedInputChannel,
  outputError: state.mididevices.outputError,
  outputMap: state.mididevices.outputMap
}))