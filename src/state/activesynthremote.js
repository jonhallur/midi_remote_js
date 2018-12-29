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
import {NotificationManager} from 'react-notifications'

var TYPEFUNCTIONS = {
  [CONTROLTYPE.SYSEX]: handleSysExControl,
  [CONTROLTYPE.CC]: handleCCControl,
  [CONTROLTYPE.NRPN]: handleNRPNControl
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
    saveRemoteName: '',
    newSaveRemoteName: '',
    saveModalOpen: false,
    presetChanged: false,
    presetName: '',
    controlsToSend: 0,
    controlsSent: 0,
    panelWidth: 3,
    panelWidths: [2,3,4,6,12],
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
    presetChanged: false,
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
  return TYPEFUNCTIONS[Number(control.type)](control);
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

function handleNRPNControl(control) {
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
  generatedHeader.push(Number(value));
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
  activesynthremote.setUsingKeyValue({key: 'presetChanged', value: true})
}, 500, {'trailing': true});

export function sendSysExData(header_id, param_id, value, key, signed) {
  let {selectedOutputChannel, selectedOutput} = mididevices.getState();
  let modified;
  if (Number(signed) > 0) {
    modified = createSignedValue(Number(signed), value);
  }
  if (midiIsReady(selectedOutputChannel, selectedOutput)) {
    var sysex_payload = createSysExHeader(header_id, param_id, modified || value, selectedOutputChannel);
    let output = WebMidi.getOutputById(selectedOutput);
    let outputBytes = PrepareOutput(sysex_payload);
    let manufacturer_bytes = outputBytes.manufacturer_bytes;
    let data_bytes = outputBytes.data_bytes;
    output.sendSysex(manufacturer_bytes, data_bytes);
    if (key) {
      sendDebouncedUpdates(key, value);
    }
  }
}

export function sendM1000ModData(sysexheaderid, path, value=[0,0,63], key, signed) {
  let {selectedOutputChannel, selectedOutput} = mididevices.getState();
  let modified;
  if (Number(signed) > 0) {
    modified = createSignedValue(Number(signed), value);
  }
  if (midiIsReady(selectedOutputChannel, selectedOutput)) {
    let [source, destination, amount] = modified || value || [0,0,63];
    var sysex_payload = createSysExHeader(sysexheaderid, path, source, selectedOutputChannel);
    sysex_payload.push(Number(amount));
    sysex_payload.push(Number(destination));
    let output = WebMidi.getOutputById(selectedOutput);
    let outputBytes = PrepareOutput(sysex_payload);
    let manufacturer_bytes = outputBytes.manufacturer_bytes;
    let data_bytes = outputBytes.data_bytes;
    output.sendSysex(manufacturer_bytes, data_bytes);
    if (key) {
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

export function sendNPRNData(parameter, value, key) {
  let {selectedOutputChannel, selectedOutput} = mididevices.getState();
  if (midiIsReady(selectedOutputChannel, selectedOutput)) {
    let output = WebMidi.getOutputById(selectedOutput);
    let param_lsb = parameter & 0x7F;
    let param_msb = (parameter >> 7) & 0x7F;
    let value_lsb = value  & 0x7F;
    let value_msb = (value >> 7) & 0x7F;
    output.setNonRegisteredParameter([param_msb, param_lsb], [value_msb, value_lsb], selectedOutputChannel);
    if(key) {
      sendDebouncedUpdates(key, value);
    }
  }
}

function sendList(listToSend) {
  if(listToSend.length === 0) {
    return;
  }
  let [value, parameter] = listToSend.pop();
  sendNPRNData(parameter, value);
  if(listToSend.length > 0) {
    setTimeout(() => {
      sendList(listToSend)
    }, 50);
  }
}

export function sendNPRNAsciiData(parameter, value, first, key) {
  let listToSend = value.map((charValue, index) => {
    return [charValue, Number(first)+Number(index)]
  }).reverse();
  sendList(listToSend);
  if(key) {
    sendDebouncedUpdates(key, value)
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
  let {selectedOutputChannel, selectedOutput} = mididevices.getState();
  if (!midiIsReady(selectedOutputChannel, selectedOutput)) {
    NotificationManager.warning("No MIDI selected, can't send patch", "MIDI Not Selected");
    activesynthremote.setReady();
    return;
  }
  let controls = [];
  for(let panel of panels) {
    for(let control of panel.controls) {
      controls.push(Object.assign(control, {value: controlValues[control.key]}))
    }
  }
  activesynthremote.setControlsToSend(controls.length);
  activesynthremote.setSending();

  sendTimedMidiParameters(controls.reverse());
}

function sendTimedMidiParameters(listToSend) {
  if(listToSend.length === 0) {
    activesynthremote.setReady();
    return;
  }
  let settings = listToSend.pop();
  if (Number(settings.type) === CONTROLTYPE.SYSEX) {
    if(Number(settings.subtype) === SUBCONTROLTYPE.M1000MOD) {
      sendM1000ModData(settings.sysexheaderid, settings.path, settings.value, null, settings.signed);
    }
    else {
      sendSysExData(settings.sysexheaderid, settings.parameter, settings.value, null, settings.signed);
    }
  }
  else if (Number(settings.type) === CONTROLTYPE.CC) {
    sendCCData(settings.parameter, settings.value, null);
  }
  else if (Number(settings.type) === CONTROLTYPE.NRPN) {
    if(Number(settings.subtype) === SUBCONTROLTYPE.ASCII) {
      sendNPRNAsciiData(settings.parameter, settings.value, settings.first, null)
    } else {
      sendNPRNData(settings.parameter, settings.value, null)
    }
  }
  activesynthremote.tickControlsSent();
  setTimeout(sendTimedMidiParameters.bind(null, listToSend), 50);
}

function createSignedValue(bitSize, oldValue) {
  let valueIsArray = oldValue.constructor === Array;
  let messageSize = 1 << Number(bitSize);
  let halfSize = messageSize / 2;
  let signedValue, newValue;
  if(valueIsArray) {
    signedValue = oldValue[2];
  }
  else {
    signedValue = oldValue;
  }
  signedValue = signedValue - halfSize;
  if (signedValue < 0) {
    signedValue = signedValue + messageSize
  }
  if (valueIsArray) {
    newValue = [oldValue[0], oldValue[1], signedValue]
  }
  else {
    newValue = signedValue;
  }
  return newValue;
}