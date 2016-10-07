import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import firebase from 'firebase'

const midicontrols = State('midicontrols', {
  initial: {
    selectedType: '',
    selectedSubType: '',
    selectedSysExHeader: '',
    showBasicPanel: true,
    showCreatePanel: true,
    showControlsPanel: true,
    name: '',
    short: '',
    parameter: '',
    minimum: '',
    maximum: '',
    default: '',
    onValue: '',
    offValue: '',
    controls: [],
    types: [
      {value: CONTROLTYPE.SYSEX, name: 'System Exclusive'},
      {value: CONTROLTYPE.CC, name: 'Continuous Controller'},
      {value: CONTROLTYPE.NRPN, name: 'Non-Registered Parameter Number'}
    ],
    subtypes: [
      {value: SUBCONTROLTYPE.RANGE, name: 'Range'},
      {value: SUBCONTROLTYPE.TOGGLE, name: 'Toggle'},
      {value: SUBCONTROLTYPE.LIST, name: 'List'},
      {value: SUBCONTROLTYPE.BITMASK, name: 'Bitmask'}
    ]
  },

  setSelectedType: (state, payload) => ({
    selectedType: payload
  }),

  setSelectedSubType: (state, payload) => ({
    selectedSubType: payload
  }),

  setSelectedSysExHeader: (state, payload) => ({
    selectedSysExHeader: payload
  }),

  setName: (state, payload) => ({
    name: payload
  }),

  setShort: (state, payload) => ({
    short: payload
  }),

  setParameter: (state, payload) => ({
    parameter: payload
  }),

  setMinimum: (state, payload) => ({
    minimum: payload
  }),

  setMaximum: (state, payload) => ({
    maximum: payload
  }),

  setDefault: (state, payload) => ({
    default: payload
  }),

  setControls: (state, payload) => ({
    controls: payload
  }),

  clearRangeInputs: (state, payload) => ({
    name: '',
    short: '',
    parameter: '',
    minimum: '',
    maximum: '',
    default: ''
  }),

  toggleBasicPanel: (state, payload) => ({
    showBasicPanel: !state.showBasicPanel
  }),

  toggleCreatePanel: (state, payload) => ({
    showCreatePanel: !state.showCreatePanel
  }),

  toggleControlsPanel: (state, payload) => ({
    showControlsPanel: !state.showControlsPanel
  })

});

export default midicontrols

export function getControls(remote_id, panel_id) {
  if (panel_id === '' || remote_id === ''){
    console.log("Broken input on getting controls");
    return;
  }
  let refList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
  firebase.database().ref(refList.join('/')).on('value', function(snapshot) {
    let controlList = [];
    snapshot.forEach(function(child) {
      let controlData = {...child.val(), key: child.key};
      controlList.push(controlData);
    });
    midicontrols.setControls(controlList);
  })
}

/*
*
* MOVED TO GENERIC

export function addControl(remote_id, panel_id, control_data) {
  let refList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
  var ref = firebase.database().ref(refList.join('/'));
  ref.once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      let controls = [];
      console.log(snapshot.val());
      snapshot.val().forEach(control => controls.push(control));
      controls.push(control_data);
      ref.set(controls);
    }
    else {
      ref.set([control_data]);
    }
  });
}

*/