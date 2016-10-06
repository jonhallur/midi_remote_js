import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'

const midicontrols = State('midicontrols', {
  initial: {
    selectedType: '',
    selectedSubType: '',
    selectedSysExHeader: '',
    name: '',
    parameter: '',
    minimum: '',
    maximum: '',
    default: '',
    onValue: '',
    offValue: '',

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
  })
});

export default midicontrols