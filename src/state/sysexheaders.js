/**
 * Created by jonhallur on 25.8.2016.
 */
import { State } from 'jumpsuit';
import {firebase_initialized, initializeFirebase} from './test'

var firebase = require('firebase');

const sysexheaders = State('sysexheaders', {
    initial: {
        sysexheader: {},
        sysexheaderReady: false,
        sysexheaderName: '',
        sysexheaderManufacturerId: '',
        sysexheaderFields: [],
        sysexheaderExists: false,
        sysexheadersReady: false,
        sysexheaders: [],
        sysexheaderFieldName: '',
        sysexheaderFieldValue: '',
        sysexheaderFieldChannelMod: false
    },

    setSysexheader: (state, payload) => ({
        sysexheader: payload,
        sysexheaderName: payload.name,
        sysexheaderManufacturerId: payload.manufacturer_id,
        sysexheaderFields: payload.fields,
        sysexheaderReady: true
    }),

    setNameField: (state, payload) => ({
      sysexheaderName: payload
    }),

    setManufacturerIdField: (state, payload) => ({
        sysexheaderManufacturerId: payload
    }),
    setSysexheaders: (state, payload) => ({
        sysexheaders: payload,
        sysexheadersReady: true
    }),
    setFieldName: (state, payload) => ({
        sysexheaderFieldName: payload
    }),
    setFieldValue: (state, payload) => ({
        sysexheaderFieldValue: payload
    }),
    setFieldChannelMod: (state, payload) => ({
        sysexheaderFieldChannelMod: payload
    })

});

export default sysexheaders

export function getSysexheaders() {
    initializeFirebase();
    firebase.database().ref('admin/sysexheaders').on("value", function(snapshot) {
        var data = snapshot.val();
        sysexheaders.setSysexheaders(data);
    }, function(errorObject) {
        console.log("sysexheaders read failed");
    });
}

export function addSysexheader(name, manufacturer_id) {
    var key = firebase.database().ref('admin/sysexheaders');
    key.orderByChild("name").equalTo(name).once('value', function(snapshot) {
        if (snapshot.exists()) {
            console.log(name, " already exists")
        }
        else {
            key.push({name: name, manufacturer_id: manufacturer_id, fields: []});
        }
    });
}

export function removeSysexheader(key) {
    var ref = firebase.database().ref('admin/sysexheaders');
    ref.child(key).remove(function(error) {
        if(!error) {
            console.log("sysexheader", key, "removed")
        }
        else {
            console.log("sysexheader removal error")
        }
    })
}

export function addSysexheaderfield(key, name, value, channel_mod) {
    if(!(key && name && value && channel_mod !== undefined)) {
        console.log("broken input");
        return;
    }
    var ref = firebase.database().ref('admin/sysexheaders/' + key + '/fields');
    ref.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
            var data = snapshot.val();
            var length = Object.keys(data).length;
            ref.child(length).set({name: name, value: value, channel_mod: channel_mod});
        }
        else {
            ref.child(0).set({name: name, value: value, channel_mod: channel_mod});
        }
    });
}

export function swapSysexheaderfields(key, from, to) {
    if(key) {
        var ref = firebase.database().ref('admin/sysexheaders/' + key + '/fields');
        ref.once('value').then(function(snapshot) {
            if(snapshot.exists()) {
                var data_from = snapshot.val()[from];
                var data_to = snapshot.val()[to];
                ref.child(from).set(data_to);
                ref.child(to).set(data_from);
            }
        })
    }
}

export function deleteSysexheaderfield(key, id) {
    var ref = firebase.database().ref('admin/sysexheaders/' + key + '/fields');
    ref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        var length = Object.keys(data).length;
        for(var key=0; key<length;key++ ) {
            if(key > id) {
                var move_data = snapshot.val()[key];
                ref.child(key-1).set(move_data);
            }
        }
        ref.child(length-1).remove(function(error) {
            if(!error) {
                console.log("manufacturer", key, "removed")
            }
            else {
                console.log("manufacturer removal error")
            }
        });

    })
}

export function clearSysexheader() {
    sysexheaders.setNameField('');
    sysexheaders.setManufacturerIdField('');
}

export  function getSingleSysexheader(key) {
    console.log("key", key);
    firebase.database().ref('admin/sysexheaders/' + key).on("value", function(snapshot) {
        sysexheaders.setSysexheader(snapshot.val());
    });
    return null;
}