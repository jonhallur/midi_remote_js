/**
 * Created by jonh on 15.9.2016.
 */
import {State} from 'jumpsuit'
import uuid from 'uuid'
import firebase from 'firebase'

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

  setPanelName: (state, payload) => ({
    synthpanel: { name: payload, controls: state.synthpanel.controls }
  }),

});

export default synthpanels

export function addPanel(remote_id, name) {
  if(!(remote_id && name !== undefined)) {
    console.log("broken input");
    return;
  }
  var ref = firebase.database().ref('admin/synthremotes/' + remote_id + '/panels');
  ref.once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      let panels = [];
      snapshot.val().forEach(panel => panels.push(panel));
      panels.push({name:name, key: uuid.v4(), controls: []});
      ref.set(panels);
    }
    else {
      ref.set([{name: name, key: uuid.v4(), controls: []}]);
    }
  });
}

export function updatePanelName(pathList, name) {
  var ref = firebase.database().ref(pathList.join('/'));
  ref.once('value', function (snapshot) {
    if(snapshot.exists()) {
      ref.update({name: name});
    }
    else {
      console.log("Error, trying to update non existing snapshot")
    }
    //console.log(snapshot.val());
  })
}

export function getSynthPanel(pathList) {
  firebase.database().ref(pathList.join('/')).on("value", function(snapshot) {
    var data = snapshot.val();
    var controls = [];
    if (data.controls !== undefined) {
      data.controls.forEach(panel => controls.push(panel));
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