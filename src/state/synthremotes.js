/**
 * Created by jonhallur on 3.9.2016.
 */
import { State } from 'jumpsuit';
import { initializeFirebase} from './authentication'

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
          panels: []
      }
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
    setSynthremotePanelName: (state, payload) => ({
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
      let synthremotelist = [];
      snapshot.forEach(function(child) {
        synthremotelist.push({...child.val(), key:child.key})
      });
      synthremotes.setSynthRemotes(synthremotelist);

      //var data = snapshot.val();
      //synthremotes.setSynthRemotes(data);
    }, function(errorObject) {
        console.log("synthremotes read failed", errorObject);
    });
}

export function getSynthRemote(key) {
    firebase.database().ref('admin/synthremotes/' + key).on("value", function(snapshot) {
        var data = snapshot.val();
        var panels = [];
        if (data.panels !== undefined) {
          data.panels.forEach(panel => panels.push({...panel, key: panel.key }));
        }
        synthremotes.setSynthRemote({
            name: data.name,
            manufacturer_id: data.manufacturer_id,
            panels: panels,
            key: snapshot.key
        });
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