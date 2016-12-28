/**
 * Created by jonh on 17.10.2016.
 */
import mididevices, {initializeMidi} from '../state/mididevices'
import {Component} from 'jumpsuit'
import Selector from './input/arrayselector'

export default Component({
  componentDidMount() {
    initializeMidi();
  },

  render() {
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

        <Selector
          outputError={this.props.outputError}
          label="Out"
          default_text="Select Output"
          value={this.props.selectedOutput}
          data={this.props.outputs}
          id="midi-outputs"
          eventhandler={event => mididevices.setSelectedOutput(event.target.value)}
        />

        <Selector
          outputError={this.props.outputError}
          label=""
          default_text="Channel"
          value={this.props.selectedOutputChannel}
          data={this.props.midiChannels}
          eventhandler={event => mididevices.setSelectedOutputChannel(event.target.value)}
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
  outputError: state.mididevices.outputError
}))