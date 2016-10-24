/**
 * Created by jonhallur on 21.8.2016.
 */

import { State } from 'jumpsuit';
import {firebase_initialized, initializeFirebase} from './authentication'

var firebase = require('firebase');

const manufacturers = State('manufacturers', {
    initial: {
        manufacturersReady: false,
        manufacturers: [],
        manufacturerReady: false,
        manufacturer: {},
        manufacturerName: '',
        manufacturerId: '',
        manufacturerMsbId: '',
        manufacturerLsbId: '',
        manufacturerExtendedHeader: false
    },

    updateData: (state, payload) => ({
        manufacturersReady: true,
        manufacturers: payload
    }),

    setManufacturer: (state, payload) => ({
        manufacturer: payload,
        manufacturerName: payload.name,
        manufacturerId: payload.manufacturer_sys_ex_id[0],
        manufacturerLsbId: payload.extended ? payload.manufacturer_sys_ex_id[0] : undefined,
        manufacturerMsbId: payload.extended ? payload.manufacturer_sys_ex_id[1] : undefined,
        manufacturerExtendedHeader: payload.extended,
        manufacturerReady: true
    }),

    clearManufacturer: (state, payload) => ({
        manufacturerReady: false,
        manufacturer: {},
        manufacturerName: '',
        manufacturerId: '',
        manufacturerMsbId: '',
        manufacturerLsbId: '',
        manufacturerExtendedHeader: false
    }),

    setNameField: (state, name) => ({
        manufacturerName: name
    }),

    setIdField: (state, id) => ({
        manufacturerId: id,
    }),

    setExtendedField: (state, payload) => ({
        manufacturerExtendedHeader: payload,
    }),

    setMsbIdField: (state, id) => ({
        manufacturerMsbId: id
    }),

    setLsbIdField: (state, id) => ({
        manufacturerLsbId: id
    }),
});

export default manufacturers

export function getManufacturers() {
    if (!firebase_initialized) {
        initializeFirebase()
    }
    firebase.database().ref('admin/manufacturers').on("value", function(snapshot) {

        if (!snapshot.exists()) {
            insertDefaultManufacturers()
        }
        var data = snapshot.val();
        manufacturers.updateData(data);
    }, function(errorObject) {
        console.log("read failed");
    });
}

export function addManufacturer(name, sys_ex_id_list, extended) {
    var key = firebase.database().ref('admin/manufacturers');
    key.orderByChild("name").equalTo(name).once('value', function(snapshot) {
        if (snapshot.exists()) {
            console.log(name, " already exists")
        }
        else {
            key.push({name: name, manufacturer_sys_ex_id: sys_ex_id_list, extended: extended});
        }
    });
}

export function updateManufacturer(key, name, sys_ex_id_list, extended) {
    var ref = firebase.database().ref('admin/manufacturers/' + key);
    ref.child('name').set(name);
    ref.child('extended').set(extended);
    ref.child('manufacturer_sys_ex_id').set(sys_ex_id_list);
}

export function removeManufacturer(key) {
    var ref = firebase.database().ref('admin/manufacturers');
    ref.child(key).remove(function(error) {
        if(!error) {
            console.log("manufacturer", key, "removed")
        }
        else {
            console.log("manufacturer removal error")
        }
    })
}

export function getSingleManufacturer(key) {
    console.log("key", key);
    firebase.database().ref('admin/manufacturers/' + key).once("value", function(snapshot) {
        manufacturers.setManufacturer(snapshot.val());
    });
    return null;
}

export function clearManufacturer() {
    manufacturers.setNameField('');
    manufacturers.setIdField('');
    manufacturers.setLsbIdField('');
    manufacturers.setMsbIdField('');
    manufacturers.setExtendedField(false);
}

function insertDefaultManufacturers() {
    var key = firebase.database().ref('admin/manufacturers');
    key.push({name: "Sequential Circuits", manufacturer_sys_ex_id: [0x01], extended: false});
    key.push({name: "Big Briar", manufacturer_sys_ex_id: [0x02], extended: false});
    key.push({name: "Octave / Plateau", manufacturer_sys_ex_id: [0x03], extended: false});
    key.push({name: "Moog", manufacturer_sys_ex_id: [0x04], extended: false});
    key.push({name: "Passport Designs", manufacturer_sys_ex_id: [0x05], extended: false});
    key.push({name: "Lexicon", manufacturer_sys_ex_id: [0x06], extended: false});
    key.push({name: "Kurzweil", manufacturer_sys_ex_id: [0x07], extended: false});
    key.push({name: "Fender", manufacturer_sys_ex_id: [0x08], extended: false});
    key.push({name: "Gulbransen", manufacturer_sys_ex_id: [0x09], extended: false});
    key.push({name: "Delta Labs", manufacturer_sys_ex_id: [0x0A], extended: false});
    key.push({name: "Sound Comp.", manufacturer_sys_ex_id: [0x0B], extended: false});
    key.push({name: "General Electro", manufacturer_sys_ex_id: [0x0C], extended: false});
    key.push({name: "Techmar", manufacturer_sys_ex_id: [0x0D], extended: false});
    key.push({name: "Matthews Research", manufacturer_sys_ex_id: [0x0E], extended: false});
    key.push({name: "Oberheim", manufacturer_sys_ex_id: [0x10], extended: false});
    key.push({name: "PAIA", manufacturer_sys_ex_id: [0x11], extended: false});
    key.push({name: "Simmons", manufacturer_sys_ex_id: [0x12], extended: false});
    key.push({name: "DigiDesign", manufacturer_sys_ex_id: [0x13], extended: false});
    key.push({name: "Fairlight", manufacturer_sys_ex_id: [0x14], extended: false});
    key.push({name: "Peavey", manufacturer_sys_ex_id: [0x1B], extended: false});
    key.push({name: "JL Cooper", manufacturer_sys_ex_id: [0x15], extended: false});
    key.push({name: "Lowery", manufacturer_sys_ex_id: [0x16], extended: false});
    key.push({name: "Lin", manufacturer_sys_ex_id: [0x17], extended: false});
    key.push({name: "Emu", manufacturer_sys_ex_id: [0x18], extended: false});
    key.push({name: "Bon Tempi", manufacturer_sys_ex_id: [0x20], extended: false});
    key.push({name: "S.I.E.L.", manufacturer_sys_ex_id: [0x21], extended: false});
    key.push({name: "SyntheAxe", manufacturer_sys_ex_id: [0x23], extended: false});
    key.push({name: "Hohner", manufacturer_sys_ex_id: [0x24], extended: false});
    key.push({name: "Crumar", manufacturer_sys_ex_id: [0x25], extended: false});
    key.push({name: "Solton", manufacturer_sys_ex_id: [0x26], extended: false});
    key.push({name: "Jellinghaus Ms", manufacturer_sys_ex_id: [0x27], extended: false});
    key.push({name: "CTS", manufacturer_sys_ex_id: [0x28], extended: false});
    key.push({name: "PPG", manufacturer_sys_ex_id: [0x29], extended: false});
    key.push({name: "Elka", manufacturer_sys_ex_id: [0x2F], extended: false});
    key.push({name: "Cheetah", manufacturer_sys_ex_id: [0x36], extended: false});
    key.push({name: "Waldorf", manufacturer_sys_ex_id: [0x3E], extended: false});
    key.push({name: "Kawai", manufacturer_sys_ex_id: [0x40], extended: false});
    key.push({name: "Roland", manufacturer_sys_ex_id: [0x41], extended: false});
    key.push({name: "Korg", manufacturer_sys_ex_id: [0x42], extended: false});
    key.push({name: "Yamaha", manufacturer_sys_ex_id: [0x43], extended: false});
    key.push({name: "Casio", manufacturer_sys_ex_id: [0x44], extended: false});
    key.push({name: "Akai", manufacturer_sys_ex_id: [0x45], extended: false});
}