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
    selectedType: ''
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
  
  
});

export default synthpanels