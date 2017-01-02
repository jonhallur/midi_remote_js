/**
 * Created by jonh on 17.10.2016.
 */
import mididevices, {initializeMidi} from '../state/mididevices'
import {saveLastUsedMidiDevice} from '../state/synthremotes'
import {Component} from 'jumpsuit'
import TreeSelector from 'rc-tree-select'
import {setMidiThru} from "../state/mididevices";

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

  onMidiInputSelected(value) {
    if (value === undefined) {
      return;
    }
    let [device, channel] = value.split(',');
    mididevices.setSelectedInput(device);
    mididevices.setSelectedInputChannel(channel);
    setMidiThru()
  },

  render() {
    let {inputs, outputs, selectedInput, selectedOutput, selectedInputChannel, selectedOutputChannel} = this.props;
    let selectedOutDeviceChannel = selectedOutput && selectedOutputChannel ? outputs[selectedOutput].name + ' - Ch: ' + (selectedOutputChannel) : '';
    let selectedInDeviceChannel = selectedInput && selectedInputChannel ? inputs[selectedInput].name + ' - Ch: ' + (selectedInputChannel) : '';
    return (
      <div className="midi-settings-box">
        <label>
          Output:
          <TreeSelector
            style={{ width: 175 }}
            transitionName="rc-tree-select-dropdown-slide-up"
            choiceTransitionName="rc-tree-select-selection__choice-zoom"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            placeholder={<i>Select Midi Out</i>}
            treeData={this.props.outputMap}
            treeLine treeDefaultExpandAll
            showSearch={false}
            treeNodeFilterProp="label"
            filterTreeNode={true}
            treeDataSimpleMode={{id: 'key', rootPId: 0}}
            value={selectedOutDeviceChannel}
            onChange={this.onMidiOutputSelected}
          />
        </label>
        <label style={{marginLeft: 20}}>
          Input:
          <TreeSelector
            style={{ width: 175 }}
            transitionName="rc-tree-select-dropdown-slide-up"
            choiceTransitionName="rc-tree-select-selection__choice-zoom"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            placeholder={<i>Select Midi In</i>}
            treeData={this.props.inputMap}
            treeLine treeDefaultExpandAll
            showSearch={false}
            treeNodeFilterProp="label"
            filterTreeNode={true}
            treeDataSimpleMode={{id: 'key', rootPId: 0}}
            value={selectedInDeviceChannel}
            onChange={this.onMidiInputSelected}
          />
        </label>
      </div>
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
  outputMap: state.mididevices.outputMap,
  inputMap: state.mididevices.inputMap
}))