/**
 * Created by jonh on 17.10.2016.
 */
import WebMidi from 'webmidi'
import {State} from 'jumpsuit'
import {NotificationManager} from 'react-notifications'

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
    midiModalOpen: false,
  },
  openMidiModal: (state, payload) => ({
    midiModalOpen: true
  }),
  closeMidiModal: (state, payload) => ({
    midiModalOpen: false
  }),
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
  setInputMap: (state, payload) => ({
    inputMap: payload
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
      let inputs = [];
      console.log(WebMidi.inputs);
      console.log(WebMidi.outputs);
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
        (output, index) => {
          let {name, id} = output;
          outputs.push({key: index+1, pId: 0, label: name});
          outputs = outputs.concat([...Array(16)].map((v,i)=> (
          {
            id: id,
            key: (index+1)*100+i,
            pId: index+1,
            label: "Channel " + (i+1),
            value: [id, i+1].toString()
          })));
        }
      );
      mididevices.setOutputMap(outputs);

      WebMidi.inputs.map(
        (input, index) => {
          let {name, id} = input;
          inputs.push({key: index+1, pId: 0, label: name});
          inputs = inputs.concat([...Array(16)].map((v,i)=> (
          {
            id: id,
            key: (index+1)*200+i,
            pId: index+1,
            label: "Channel " + (i+1),
            value: [id, i+1].toString()
          })));
        }
      );
      mididevices.setInputMap(inputs);
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
  let midi_found = false;
  WebMidi.outputs.map(
    (output) => {
      if(output.name === name && !midi_found) {
        mididevices.setSelectedOutput(output.id);
        mididevices.setSelectedOutputChannel(channel);
        midi_found = true
      }
    }
  );
  if (!midi_found) {
    NotificationManager.warning("Couldn't find last used MIDI device", "MIDI", 5000);
  }
}

export function setMidiThru() {
  let {selectedInput, selectedOutput} = mididevices.getState();
  let input = WebMidi.getInputById(selectedInput)._midiInput;
  let output = WebMidi.getOutputById(selectedOutput)._midiOutput;
  input.onmidimessage = (event) => {
    output.send(event.data);
  }
}