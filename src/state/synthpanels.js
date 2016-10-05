/**
 * Created by jonh on 15.9.2016.
 */
import {State} from 'jumpsuit'

var firebase = require('firebase');

const synthpanels = State('synthpanels', {
  initial: {
    synthpanelsReady: false,
    synthpanels: [],
    synthpanelReady: false,
    synthpanel: {name: '', controls: []},
    selectedType: '',
    selectedSubType: '',
    selectedSysExHeader: '',
  },

  setPanels: (state, payload) => ({
    synthpanels: payload,
    synthpanelsReady: true,
    sunthpanelReayd: false

  }),

  setPanel: (state, payload) => ({
    synthpanel: payload,
    synthpanelReady: true,
    synthpanelsReady: false
  }),

  setSelectedType: (state, payload) => ({
    selectedType: payload
  }),

  setSelectedSubType: (state, payload) => ({
    selectedSubType: payload
  }),

  setSelectedSysExHeader: (state, payload) => ({
    selectedSysExHeader: payload
  })


  
  
});

export default synthpanels