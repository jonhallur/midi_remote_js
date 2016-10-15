/**
 * Created by jonh on 9.10.2016.
 */
import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import {getSingleSysexheader} from './sysexheaders'
import {SysExHeader} from "../pojos/SysExHeader";
import {SysExHeaderField, SysExHeaderChannelModifiedField} from "../pojos/SysExHeaderField";

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
    sysexheaders: []

  },

  setSynthRemote: (state, payload) => ({
    name: payload.name,
    remote_id: payload.key,
    synthPrototype: payload
  }),

  setSysexheader: (state, payload) => ({
    sysexheaders: [...state.sysexheaders, payload]
  })
});

export default activesynthremote;

export function createActiveSynthRemote(synthremote) {
  activesynthremote.setSynthRemote(synthremote);
  for(let panel of synthremote.panels) {
    for(let control of panel.controls) {
      handleControl(control);
    }
  }
}

function handleControl(control) {
  TYPEFUNCTIONS[control.type](control);
}

function handleSysExControl(control) {
  let header_id = control.sysexheaderid;
  getSingleSysexheader(header_id, sysexheaderCallback);
  SUBTYPEFUNCTIONS[control.subtype](control);

}

function handleRangeControl(control) {
  console.log(control.name)
}

function handleListControl(control) {
  console.log(control.name)
}

function handleToggleControl(control) {
  console.log(control.name)
}

function handleBitmaskControl(control) {
  console.log(control.name)
}

function sysexheaderCallback(key, data) {
  let sysexheaders = activesynthremote.getState().sysexheaders;
  let notInList = true;
  for (let i = 0; i < sysexheaders.length; i++) {
    let item = sysexheaders[i];
    if (item.key === key) {
      notInList = false;
      break;
    }
  }
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