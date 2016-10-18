/**
 * Created by jonh on 17.10.2016.
 */
import WebMidi from 'webmidi'
import {State} from 'jumpsuit'

const mididevices = State('mididevices', {
  initial: {
    inputs: [],
    outputs: [],
    channels: [...Array(16)].map((v,i)=> ({name: i+1, value: i+1})),
    selectedOutput: '',
    selectedInput: '',
    selectedOutputChannel: '',
    selectedInputChannel: '',

  },

  setInputs: (state, payload) => ({
    inputs: payload
  }),

  setOutputs: (state, payload) => ({
    outputs: payload
  }),

  setSelectedInput: (state, payload) => ({
    selectedInput: payload
  }),

  setSelectedOutput: (state, payload) => ({
    selectedOutput: payload
  }),

  setSelectedInputChannel: (state, payload) => ({
    selectedInputChannel: payload
  }),

  setSelectedOutputChannel: (state, payload) => ({
    selectedOutputChannel: payload
  }),
});

export default mididevices;

export function initializeMidi() {
  WebMidi.enable(function (err) {
    if (err) {
      console.log("WebMidi could not be enabled", err)
    }
    else {
      mididevices.setInputs(
        WebMidi.inputs.map(
          input => (
            Object.assign(input, {value: input.id})
          )
        )
      );
      mididevices.setOutputs(
        WebMidi.outputs.map(
          output => (
            Object.assign(output, {value: output.id})
          )
        )
      );
    }
  }, true)
}