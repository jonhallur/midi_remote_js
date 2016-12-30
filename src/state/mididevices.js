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
    outputError: false,
    errorHandle: null,
    outputMap: [],
  },
  setError: (state, payload) => ({
    outputError: true
  }),
  clearError: (state, payload) => ({
    outputError: false
  }),
  setErrorHandle: (state, payload) => ({
    errorHandle: payload
  }),
  clearErrorHandle: (state, payload) => ({
    errorHandle: null
  }),
  setInputs: (state, payload) => ({
    inputs: payload
  }),

  setOutputs: (state, payload) => ({
    outputs: payload
  }),
  setOutputMap: (state, payload) => ({
    outputMap: payload
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
      let outputs = [];
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
      WebMidi.outputs.map(
        (output) => {
          let {name, id} = output;
          id = Number(id);
          outputs.push({key: id+1, pId: 0, label: name});
          outputs = outputs.concat([...Array(16)].map((v,i)=> (
            {
              key: (id+1)*100+i,
              pId: id+1,
              label: "Channel " + (i+1),
              value: [id, i+1].toString()
            })));
        }
      );
      mididevices.setOutputMap(outputs);
    }
  }, true)
}

function clearActiveTimeout() {
  let {errorHandle} = mididevices.getState();
  if (errorHandle !== null) {
    clearTimeout(errorHandle);
    mididevices.clearErrorHandle();
  }
}
export function toggleTimedErrorFeedback() {
  mididevices.setError();
  clearActiveTimeout();
  let handle = setTimeout(() => {
    mididevices.clearError();
    clearActiveTimeout();
  }, 5000);
  mididevices.setErrorHandle(handle)
}

export function setMidiDeviceFromName(name, channel) {
  WebMidi.outputs.map(
    (output) => {
      if(output.name === name) {
        mididevices.setSelectedOutput(output.id);
        mididevices.setSelectedOutputChannel(channel);
      }
    }
  )
}