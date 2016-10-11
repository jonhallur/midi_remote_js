/**
 * Created by jonh on 9.10.2016.
 */
import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import {getSingleSysexheader} from './sysexheaders'

var TYPEFUNCTIONS = {[CONTROLTYPE.SYSEX]: handleSysExControl};
var SUBTYPEFUNCTIONS = {[SUBCONTROLTYPE.RANGE]: handleRangeControl};



const activesynthremote = State('activesynthremote',{
  initial: {
    remote_id: '',
    name: '',
    panels: [],
    synthPrototype: {},
    sysexheaders: {}

  },

  setSynthRemote: (state, payload) => ({
    name: payload.name,
    remote_id: payload.key,
    synthPrototype: payload
  }),

  setSysexheader: (state, payload) => ({
    sysexheaders: {...state.sysexheaders, payload}
  })
});

export default activesynthremote;

export function createActiveSynthRemote(synthremote, sysexheaders) {
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
  let sysex_id = control.sysexheaderid;
  let sysexheader = getSingleSysexheader(sysex_id, sysexheaderCallback);

}

function handleRangeControl(control) {
  console.log(control.name)
}

function sysexheaderCallback(key, data) {
  activesynthremote.setSysexheader({key: key, value: data})
}