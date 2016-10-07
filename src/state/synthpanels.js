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

export function addPanel(key, name) {
  if(!(key && name !== undefined)) {
    console.log("broken input");
    return;
  }
  var ref = firebase.database().ref('admin/synthremotes/' + key + '/panels');
  ref.once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      let panels = [];
      snapshot.val().forEach(panel => panels.push(panel));
      panels.push({name:name, controls: []});
      ref.set(panels);
    }
    else {
      ref.set([{name: name, controls: []}]);
    }
  });
}



export function swapSynthRemotePanels(key, source, target) {
  var ref = firebase.database().ref('admin/synthremotes/' +  key + '/panels');
  ref.once('value').then(function(snapshot) {
    if(snapshot.exists()) {
      var panels = [];
      snapshot.val().forEach(panel => panels.push(panel));
      let temp = panels[source];
      panels[source] = panels[target];
      panels[target] = temp;
      ref.set(panels);
    }
  })
}

export function deleteSynthRemotePanel(key, id) {
  var ref = firebase.database().ref('admin/synthremotes/' +  key + '/panels');
  ref.once('value').then(function(snapshot) {
    if(snapshot.exists()) {
      var panels = [];
      console.log("deleting id", id);
      snapshot.val().forEach(panel => panels.push(panel));
      panels.splice(id, 1);
      ref.set(panels);
    }
  })
}