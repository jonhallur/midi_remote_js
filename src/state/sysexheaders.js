/**
 * Created by jonhallur on 25.8.2016.
 */
import { State } from 'jumpsuit';
import { initializeFirebase} from './test'
import firebase from 'firebase'

//var firebase = require('firebase');

const sysexheaders = State('sysexheaders', {
    initial: {
        sysexheader: {
            name: '',
            manufacturer_id: '',
            fields: []
        },
        sysexheadername: '',
        sysexheaderReady: false,
        sysexheaderFields: [],
        sysexheaderExists: false,
        sysexheadersReady: false,
        sysexheaders: [],
        sysexheaderFieldName: '',
        sysexheaderFieldValue: '',
        sysexheaderFieldChannelMod: false,
        compatibleSysExHeaders: []
    },

    setSysexheader: (state, payload) => ({
        sysexheader: payload,
        sysexheaderReady: true
    }),

    setNameField: (state, payload) => ({
      sysexheader: {
          name: payload,
          manufacturer_id: state.sysexheader.manufacturer_id,
          fields: state.sysexheader.fields }
    }),

    setManufacturerIdField: (state, payload) => ({
        sysexheader: {
            name: state.sysexheader.name,
            manufacturer_id: payload,
            fields: state.sysexheader.fields }
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
    }),
    setCompatibleSysexHeaders: (state, payload) => ({
        compatibleSysExHeaders: payload
    })

});

export default sysexheaders

export function getSysexheaders() {
    initializeFirebase();
    firebase.database().ref('admin/sysexheaders').on("value", function(snapshot) {
        var data = snapshot.val();
        sysexheaders.setSysexheaders(data);
    }, function(errorObject) {
        console.log("sysexheaders read failed", errorObject);
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
            var fields = [];
            data.forEach(field => fields.push(field));
            fields.push({name:name, value: value, channel_mod: channel_mod});
            ref.set(fields);
        }
        else {
            ref.set([{name: name, value: value, channel_mod: channel_mod}]);
        }
    });
}

export function swapSysexheaderfields(key, source, target) {
    if(key) {
        var ref = firebase.database().ref('admin/sysexheaders/' + key + '/fields');
        ref.once('value').then(function(snapshot) {
            if(snapshot.exists()) {
                var fields = [];
                snapshot.val().forEach(field => fields.push(field));
                var temp = fields[source];
                fields[source] = fields[target];
                fields[target] = temp;
                ref.set(fields);
            }
        })
    }
}

export function deleteSysexheaderfield(key, id) {
    var ref = firebase.database().ref('admin/sysexheaders/' + key + '/fields');
    ref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        var fields = [];
        data.forEach(field => fields.push(field));
        fields.splice(id, 1);
        ref.set(fields);

    })
}

export function clearSysexheader() {
    sysexheaders.setNameField('');
    sysexheaders.setManufacturerIdField('');
}

export  function getSingleSysexheader(key) {
    console.log("key", key);
    firebase.database().ref('admin/sysexheaders/' + key).on("value", function(snapshot) {
        let data = snapshot.val();
        let fields = [];
        if(data.fields !== undefined) {
            fields = data.fields.forEach(field => fields.push(field))
        }
        data.fields = fields;
        sysexheaders.setSysexheader(snapshot.val());
    });
    return null;
}

export function getSysExHeaderFromManufacturerId(manufacturerId) {
    console.log("manud", manufacturerId);
    firebase.database().ref('admin/sysexheaders').on('value', function(snapshot) {
        let compatibleSysExHeaders = [];
        snapshot.forEach(function(item) {
            let value = item.val();
            if (value.manufacturer_id === manufacturerId) {
                compatibleSysExHeaders.push({value: item.key, name: value.name})
            }
        });
        sysexheaders.setCompatibleSysexHeaders(compatibleSysExHeaders);
    })
}