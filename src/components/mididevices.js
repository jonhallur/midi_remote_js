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
          label="Out"
          default_text="Select Output"
          value={this.props.selectedOutput}
          data={this.props.outputs}
          id="midi-outputs"
          eventhandler={event => mididevices.setSelectedOutput(event.target.value)}
        />
      </form>
    )
  }
}, (state) => ({
  inputs: state.mididevices.inputs,
  outputs: state.mididevices.outputs,
  selectedInput: state.mididevices.selectedInput,
  selectedOutput: state.mididevices.selectedOutput
}))