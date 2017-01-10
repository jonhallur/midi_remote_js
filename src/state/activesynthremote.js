/**
 * Created by jonh on 9.10.2016.
 */
import {State} from 'jumpsuit'
import mididevices from './mididevices'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import {getSingleSysexheader} from './sysexheaders'
import {SysExHeaderChannel} from '../pojos/SysExHeader'
import {SysExHeaderField, SysExHeaderChannelModifiedField} from "../pojos/SysExHeaderField";
import {toggleTimedErrorFeedback} from "./mididevices"
import {getLastSavedRemoteSettings, setRemoteSettingsValue} from './synthremotes'
import _ from 'lodash'
import WebMidi from 'webmidi'
import {getLastUsedMidiDevice, getUserRemotePresets} from "./synthremotes";

var TYPEFUNCTIONS = {
  [CONTROLTYPE.SYSEX]: handleSysExControl,
  [CONTROLTYPE.CC]: handleCCControl
};



const activesynthremote = State('activesynthremote',{
  initial: {
    remote_id: '',
    version: '',
    name: '',
    panels: [],
    presets: [],
    synthPrototype: {},
    sysexheaders: [],
    controlValues: {},
    showPanel: {},
    synthRemoteReady: false,
    synthRemoteCreating: false,
    synthRemoteLoading: false,
    synthRemoteSending: false,
    saveRemoteOpen: false,
    saveRemoteName: '',
    newSaveRemoteName: '',
    saveModalOpen: true,
    controlsToSend: 0,
    controlsSent: 0,
  },
  setSynthRemote: (state, payload) => ({
    name: payload.name,
    remote_id: payload.key,
    version: payload.version,
    synthPrototype: payload
  }),

  setSysexheader: (state, payload) => ({
    sysexheaders: [...state.sysexheaders, payload]
  }),

  addPanel: (state, payload) => ({
    panels: [...state.panels, payload]
  }),
  clearPanels: (state, payload) => ({
    panels: []
  }),

  setControlValues: (state, payload) => ({
    controlValues: {...state.controlValues, [payload.uuid]: payload.value}
  }),

  togglePanel: (state, payload) => ({
    showPanel: {...state.showPanel, [payload]: !state.showPanel[payload]}
  }),

  showPanel: (state, payload) => ({
    showPanel: {...state.showPanel, [payload]: true}
  }),

  setLoading: (state, payload) => ({
    synthRemoteReady: false,
    synthRemoteCreating: false,
    synthRemoteLoading: true,
    synthRemoteSending: false,
  }),
  setCreating: (state, payload) => ({
    synthRemoteReady: false,
    synthRemoteCreating: true,
    synthRemoteLoading: false,
    synthRemoteSending: false,
  }),
  setReady: (state, payload) => ({
    synthRemoteReady: true,
    synthRemoteCreating: false,
    synthRemoteLoading: false,
    synthRemoteSending: false,
  }),
  setSending: (state, payload) => ({
    synthRemoteReady: false,
    synthRemoteCreating: false,
    synthRemoteLoading: false,
    synthRemoteSending: true,
  }),
  setSaveRemoteName: (state, payload) => ({
    saveRemoteName: payload
  }),
  toggleSaveRemote: (state, payload) => ({
    saveRemoteOpen: !state.saveRemoteOpen
  }),
  setSynthRemotePresets: (state, payload) => ({
    presets: payload
  }),
  setAllControlValues: (state, payload) => ({
    controlValues: payload
  }),
  setControlsToSend: (state, payload) => ({
    controlsToSend: payload,
    controlsSent: 0
  }),
  tickControlsSent: (state, payload) => ({
    controlsSent: ++state.controlsSent
  }),
  setUsingKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),
});

export default activesynthremote;

function getLastSavedUserSettings(synthremote) {
  let version = synthremote.version;
  let remote_id = synthremote.key;
  getLastSavedRemoteSettings(remote_id, version);
}

export function createActiveSynthRemote(synthremote) {
  activesynthremote.setCreating();
  activesynthremote.clearPanels();
  activesynthremote.setSynthRemote(synthremote);
  getUserRemotePresets();
  getLastUsedMidiDevice();
  for(let panel of synthremote.panels) {
    let controls = [];
    for(let control of panel.controls) {
      activesynthremote.setControlValues({uuid: control.key, value: control.default});
      controls.push(handleControl(control));
    }
    activesynthremote.addPanel({name: panel.name, key: panel.key, controls: controls});
    activesynthremote.showPanel(panel.key);
  }
  getLastSavedUserSettings(synthremote);
}

function handleControl(control) {
  return TYPEFUNCTIONS[control.type](control);
}

function handleSysExControl(control) {
  let header_id = control.sysexheaderid;
  if(!isHeaderInList(header_id)) {
    getSingleSysexheader(header_id, sysexheaderCallback);
  }
  return control;
}

function handleCCControl(control) {
  return control
}

function isHeaderInList(key) {
  let sysexheaders = activesynthremote.getState().sysexheaders;
  let index = _.findIndex(sysexheaders, ["key", key]);
  return index !== -1;
}

function sysexheaderCallback(key, data) {
  var notInList = !isHeaderInList(key);
  if(notInList) {
    activesynthremote.setSysexheader({key: key, value: data});
  }
}

function createSysExHeader(header_id, param_id, value, selectedOutputChannel) {
  let sysexheaders = activesynthremote.getState().sysexheaders;
  let header = sysexheaders[_.findIndex(sysexheaders, ['key', header_id])];
  let data = header.value;
  let fields = [];
  data.fields.map(field => {
    if (field.channel_mod) {
      fields.push(new SysExHeaderChannelModifiedField({name: field.name, constant: Number(field.value)}))
    }
    else {
      fields.push(new SysExHeaderField({name: field.name, value: Number(field.value)}))
    }
  });
  let sysexheader = new SysExHeaderChannel({name: data.name, fields: fields});
  let generatedHeader = sysexheader.generate_header(Number(selectedOutputChannel), []);
  generatedHeader.push(Number(param_id));
  generatedHeader.push(value);
  return generatedHeader;
}

function PrepareOutput(sysex_payload) {
  let manufacturer_bytes;
  let data_bytes;
  if (sysex_payload[0] === 0) {
    manufacturer_bytes = sysex_payload.slice(0, 2);
    data_bytes = sysex_payload.slice(3);
  }
  else {
    manufacturer_bytes = sysex_payload.shift();
    data_bytes = sysex_payload;
  }
  return {manufacturer_bytes: manufacturer_bytes, data_bytes: data_bytes};
}

function midiIsReady(selectedOutputChannel, selectedOutput) {
  if (selectedOutput === '' || selectedOutputChannel === '') {
    toggleTimedErrorFeedback();
    return false;
  }
  return true;
}

const sendDebouncedUpdates = _.debounce((control_key, value) => {
  let {remote_id, version} = activesynthremote.getState();
  setRemoteSettingsValue(remote_id, version, control_key, value);
}, 500, {'trailing': true});

export function sendSysExData(header_id, param_id, value, key) {
  let {selectedOutputChannel, selectedOutput} = mididevices.getState();
  if (midiIsReady(selectedOutputChannel, selectedOutput)) {
    var sysex_payload = createSysExHeader(header_id, param_id, value, selectedOutputChannel);
    let output = WebMidi.getOutputById(selectedOutput);
    let outputBytes = PrepareOutput(sysex_payload);
    let manufacturer_bytes = outputBytes.manufacturer_bytes;
    let data_bytes = outputBytes.data_bytes;
    output.sendSysex(manufacturer_bytes, data_bytes);
    if (key) {
      console.log("sending debounced");
      sendDebouncedUpdates(key, value);
    }
  }
}
export function sendCCData(parameter, value, key) {
  let {selectedOutputChannel, selectedOutput} = mididevices.getState();
  if (midiIsReady(selectedOutputChannel, selectedOutput)) {
    let output = WebMidi.getOutputById(selectedOutput);
    output.sendControlChange(Number(parameter), Number(value), selectedOutputChannel);
    if(key) {
      sendDebouncedUpdates(key, value);
    }
  }
}

export function setControlSettingsFromRemoteData(settings, partial=true) {
  if(partial) {
    for(let control in settings) {
      if(settings.hasOwnProperty(control)) {
        activesynthremote.setControlValues({uuid: control, value: settings[control]});
      }
    }
  }
  else {
    activesynthremote.setAllControlValues(settings);
  }
  sendAllControlValues()
}

export function sendAllControlValues() {
  let {controlValues, panels} = activesynthremote.getState();
  let controls = [];
  for(let panel of panels) {
    for(let control of panel.controls) {
      controls.push(Object.assign(control, {value: controlValues[control.key]}))
    }
  }
  activesynthremote.setControlsToSend(controls.length);
  activesynthremote.setSending();
  sendTimedMidiParameters(controls);
}

function sendTimedMidiParameters(listToSend) {
  if(listToSend.length === 0) {
    activesynthremote.setReady();
    return;
  }
  let settings = listToSend.pop();
  if (Number(settings.type) === CONTROLTYPE.SYSEX) {
    sendSysExData(settings.sysexheaderid, settings.parameter, settings.value, null);
  }
  else if (Number(settings.type) === CONTROLTYPE.CC) {
    sendCCData(settings.parameter, settings.value, null);
  }
  activesynthremote.tickControlsSent();
  setTimeout(sendTimedMidiParameters.bind(null, listToSend), 10);
}