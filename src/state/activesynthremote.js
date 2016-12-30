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
import {getLastUsedMidiDevice} from "./synthremotes";

var TYPEFUNCTIONS = {[CONTROLTYPE.SYSEX]: handleSysExControl};
var SUBTYPEFUNCTIONS = {
  [SUBCONTROLTYPE.RANGE]: handleRangeControl,
  [SUBCONTROLTYPE.LIST]: handleListControl,
  [SUBCONTROLTYPE.TOGGLE]: handleToggleControl,
  [SUBCONTROLTYPE.BITMASK]: handleBitmaskControl
};



const activesynthremote = State('activesynthremote',{
  initial: {
    remote_id: '',
    version: '',
    name: '',
    panels: [],
    synthPrototype: {},
    sysexheaders: [],
    controlValues: {},
    showPanel: {},
    synthRemoteReady: false,
    synthRemoteCreating: false,
    synthRemoteLoading: false,
    synthRemoteSending: false,

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
});

export default activesynthremote;

function getLastSavedUserSettings(synthremote) {
  activesynthremote.setSending();
  let version = synthremote.version;
  let remote_id = synthremote.key;
  getLastSavedRemoteSettings(remote_id, version);
}

export function createActiveSynthRemote(synthremote) {
  activesynthremote.setCreating();
  activesynthremote.clearPanels();
  activesynthremote.setSynthRemote(synthremote);
  for(let panel of synthremote.panels) {
    let controls = [];
    for(let control of panel.controls) {
      activesynthremote.setControlValues({uuid: control.key, value: control.default});
      controls.push(handleControl(control));
    }
    activesynthremote.addPanel({name: panel.name, key: panel.key, controls: controls});
    activesynthremote.showPanel(panel.key);
  }
  getLastSavedUserSettings(synthremote)
}

function handleControl(control) {
  return TYPEFUNCTIONS[control.type](control);
}

function handleSysExControl(control) {
  let header_id = control.sysexheaderid;
  if(!isHeaderInList(header_id)) {
    getSingleSysexheader(header_id, sysexheaderCallback);
  }
  return SUBTYPEFUNCTIONS[control.subtype](control);

}

function handleRangeControl(control) {
  return control;
}

function handleListControl(control) {
  return control;
}

function handleToggleControl(control) {
  return control;
}

function handleBitmaskControl(control) {
  return control;
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
      fields.push(new SysExHeaderChannelModifiedField({name: field.name, constant: field.value}))
    }
    else {
      fields.push(new SysExHeaderField({name: field.name, value: field.value}))
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
    //NotificationManager.error("Output or channel not selected", "MIDI Error", 3000);
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
    sendDebouncedUpdates(key, value)
  }
}

export function setControlSettingsFromRemoteData(settings) {
  activesynthremote.setSending();
  console.log("Apply settings");
  for(let control in settings) {
    if(settings.hasOwnProperty(control)) {
      activesynthremote.setControlValues({uuid: control, value: settings[control]});
    }
  }
  getLastUsedMidiDevice();
  activesynthremote.setReady();
}

