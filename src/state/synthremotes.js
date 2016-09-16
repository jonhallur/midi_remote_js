/**
 * Created by jonhallur on 3.9.2016.
 */
import { State } from 'jumpsuit';
import { initializeFirebase} from './test'

var firebase = require('firebase');

const synthremotes = State('synthremotes', {
    initial: {
        synthremotesReady: false,
        synthremotes: [],
        synthremoteReady: false,
        synthremotePanelName: '',
        synthremote: {
            name: '',
            manufacturer_id: '',
            panels: [
        ]}
    },

    setManufacturerIdField: (state, payload) => ({
        manufacturerId: payload
    }),

    setNameField: (state, payload) => ({
        synthremoteName: payload
    }),

    setSynthRemotes: (state, payload) => ({
        synthremotes: payload,
        synthremotesReady: true,
        synthremoteReady: false
    }),

    setSynthRemote: (state, payload) => ({
        synthremote: payload,
        synthremoteReady: true,
        synthremotesReady: false
    }),
    setsynthremotePanelName: (state, payload) => ({
      synthremotePanelName: payload
    }),
});

export default synthremotes

export function addSynthRemote(name, manufacturer_id) {
    var key = firebase.database().ref('admin/synthremotes');
    key.orderByChild("name").equalTo(name).once('value', function(snapshot) {
        if (snapshot.exists()) {
            console.log(name, " already exists")
        }
        else {
            key.push({name: name, manufacturer_id: manufacturer_id, panels: []});
        }
    });
}

export function getSynthRemotes() {
    initializeFirebase();
    firebase.database().ref('admin/synthremotes').on("value", function(snapshot) {
        var data = snapshot.val();
        synthremotes.setSynthRemotes(data);
    }, function(errorObject) {
        console.log("sysexheaders read failed", errorObject);
    });
}

export function getSynthRemote(key) {
    console.log("key", key);
    firebase.database().ref('admin/synthremotes/' + key).on("value", function(snapshot) {
        var data = snapshot.val();
        var panels = [];
        if (data.panels !== undefined) {
          data.panels.forEach(panel => panels.push(panel));
        }
        synthremotes.setSynthRemote({
            name: data.name,
            manufacturer_id: data.manufacturer_id,
            panels: panels
        });
    });
    return null;
}

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

export function removeSynthremote(key) {
    var ref = firebase.database().ref('admin/synthremotes');
    ref.child(key).remove(function(error) {
        if(!error) {
            console.log("sysexheader", key, "removed")
        }
        else {
            console.log("sysexheader removal error")
        }
    })
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
