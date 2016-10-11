/**
 * Created by jonh on 9.10.2016.
 */
import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'

var type_to_function = {};
type_to_function[CONTROLTYPE.SYSEX] = handleSysExControl;


const activesynthremote = State('activesynthremote',{
  initial: {
    remote_id: '',
    name: '',
    panels: [],
    synthPrototype: {}

  },

  setSynthRemote: (state, payload) => ({
    name: payload.name,
    remote_id: payload.key,
    synthPrototype: payload
  })


});

export default activesynthremote;

export function createActiveSynthRemote(synthremote) {
  activesynthremote.setSynthRemote(synthremote);
  for(let panel of synthremote.panels) {
    for(let control of panel.controls) {
      //TYPE_TO_FUNCTION[control.type](control)
      console.log(control.type);
      console.log(type_to_function[control.type.toString()]);
      console.log(type_to_function);
    }
  }
}

function handleSysExControl(control) {
  console.log("Handle sysex". control.name)
}

function handleRangeControl(control) {
  console.log(control.name)
}