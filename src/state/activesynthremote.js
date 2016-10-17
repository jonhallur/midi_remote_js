/**
 * Created by jonh on 9.10.2016.
 */
import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import {getSingleSysexheader} from './sysexheaders'
import {SysExHeader} from "../pojos/SysExHeader";
import {SysExHeaderField, SysExHeaderChannelModifiedField} from "../pojos/SysExHeaderField";
import _ from 'lodash'

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
    name: '',
    panels: [],
    synthPrototype: {},
    sysexheaders: [],
    controlValues: {},

  },

  setSynthRemote: (state, payload) => ({
    name: payload.name,
    remote_id: payload.key,
    synthPrototype: payload
  }),

  setSysexheader: (state, payload) => ({
    sysexheaders: [...state.sysexheaders, payload]
  }),

  addPanel: (state, payload) => ({
    panels: [...state.panels, payload]
  }),

  setControlValues: (state, payload) => ({
    controlValues: {...state.controlValues, [payload.uuid]: payload.value}
  })
});

export default activesynthremote;

export function createActiveSynthRemote(synthremote) {
  activesynthremote.setSynthRemote(synthremote);
  for(let panel of synthremote.panels) {
    let controls = [];
    for(let control of panel.controls) {
      controls.push(handleControl(control));
      activesynthremote.setControlValues({uuid: control.key, value: control.default})
    }
    activesynthremote.addPanel({name: panel.name, key: panel.key, controls: controls});

  }
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
  console.log(control.name)
}

function isHeaderInList(key) {
  let sysexheaders = activesynthremote.getState().sysexheaders;
  let index = _.findIndex(sysexheaders, ["key", key]);
  return index !== -1;
}

function sysexheaderCallback(key, data) {
  var notInList = !isHeaderInList(key);
  if(notInList) {
    let fields = [];
    data.fields.map(field => {
      if (field.channel_mod) {
        fields.push(new SysExHeaderChannelModifiedField({name: field.name, constant: field.value}))
      }
      else {
        fields.push(new SysExHeaderField({name: field.name, value: field.value}))
      }
    });
    let sysexheader = new SysExHeader({name: data.name, fields: fields});
    activesynthremote.setSysexheader({key: key, value: sysexheader});
  }
}

export function sendSysExData(key) {
  let sysexheaders = activesynthremote.getState().sysexheaders;
}