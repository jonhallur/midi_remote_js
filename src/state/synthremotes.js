/**
 * Created by jonhallur on 3.9.2016.
 */
import { State } from 'jumpsuit';
import {firebase_initialized, initializeFirebase} from './test'

var firebase = require('firebase');

const synthremotes = State('synthremotes', {
    initial: {
        synthremotesReady: false,
        synthremotes: [],
        synthremoteReady: false,
        synthremote: {},
        synthremoteName: '',
        manufacturerId: '',
    },

    setManufacturerIdField: (state, payload) => ({
        manufacturerId: payload
    }),

    setNameField: (state, payload) => ({
        synthremoteName: payload
    }),

    setSynthRemotes: (state, payload) => ({
        synthremotes: payload
    })
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
