/**
 * Created by jonhallur on 3.9.2016.
 */
import { State } from 'jumpsuit';
import { initializeFirebase} from './authentication'
import firebase from 'firebase'
import {NotificationManager} from 'react-notifications'
import authenication from './authentication'
import {setControlSettingsFromRemoteData, createActiveSynthRemote} from './activesynthremote'
import mididevices, {setMidiDeviceFromName} from './mididevices'
import activesynthremote from './activesynthremote'
import _ from 'lodash'

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

export function getSynthRemotes(ref_path='admin/synthremotes') {
    initializeFirebase();
    firebase.database().ref(ref_path).on("value", function(snapshot) {
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

export function getSynthRemote(key, refPath='admin/synthremotes/') {
  firebase.database().ref(refPath + key).on("value", function(snapshot) {
    let data = snapshot.val();
    let panels = [];
    if (data.panels !== undefined) {
      data.panels.forEach(panel => panels.push({...panel, key: panel.key }));
    }
    let synthremote = {
      name: data.name,
      manufacturer_id: data.manufacturer_id,
      panels: panels,
      version: data.version,
      key: snapshot.key
    };
    synthremotes.setSynthRemote(synthremote);
  });
}

export function getUserSynthRemote(key, refPath='public/synthremotes/') {
  firebase.database().ref(refPath + key).once("value", function(snapshot) {
    let data = snapshot.val();
    let panels = [];
    if (data.panels !== undefined) {
      data.panels.forEach(panel => panels.push({...panel, key: panel.key }));
    }
    createActiveSynthRemote(Object.assign(data, {key: snapshot.key}));
  });
}

export function getLastSavedRemoteSettings(key, version) {
  let {user} = authenication.getState();
  let path_list = ['public', 'users', user.uid, key, version, 'controls'];
  firebase.database().ref(path_list.join('/')).once('value', function(snapshot) {
    let data = snapshot.val();
    setControlSettingsFromRemoteData(data);
  })
}

export function setRemoteSettingsValue(key, version, control, value) {
  let {user} = authenication.getState();
  let path_list = ['public', 'users', user.uid, key, version, 'controls', control];
  firebase.database().ref(path_list.join('/')).set(value)
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

export function publishSynthRemote(key) {
  firebase.database().ref('admin/synthremotes/' + key).once('value', function(snapshot) {
    if (snapshot.exists()) {
      console.log("SourceFound");
      let versionKey = 'version';
      let sourceData = snapshot.val();
      let target = firebase.database().ref('public/synthremotes/' + key);
      target.once('value', function(targetSnapshot) {
        let targetVersion = 1;
        if(targetSnapshot.exists()) {
          console.log("Target Found");
          let targetData = targetSnapshot.val();
          targetVersion = targetData[versionKey] + 1;
          firebase.database().ref('public/oldersynthremotes/' + key).push(targetData);
          sourceData[versionKey] = targetVersion;
          target.set(sourceData)
        }
        else {
          console.log("Target not found");
          sourceData[versionKey] = targetVersion;
          target.set(sourceData);
        }
      })
    }
    else {
      console.log("source not found");
      NotificationManager.error("Synth source not found", "PublishSynthRemote")
    }
  })
}

export function saveLastUsedMidiDevice(device_id, channel) {
  console.log(device_id, channel);
  let {remote_id, version} = activesynthremote.getState();
  let {user} = authenication.getState();
  let path_list = ['public', 'users', user.uid, remote_id, version, 'mididevice'];
  let { outputs } = mididevices.getState();
  let name =  _.find(outputs, function(o) {return o.value === device_id}).name;
  console.log(name);
  firebase.database().ref(path_list.concat(['name']).join('/')).set(name);
  firebase.database().ref(path_list.concat(['channel']).join('/')).set(channel);
}

export function getLastUsedMidiDevice() {
  let {remote_id, version} = activesynthremote.getState();
  let {user} = authenication.getState();
  let path_list = ['public', 'users', user.uid, remote_id, version, 'mididevice'];
  firebase.database().ref(path_list.join('/')).once('value', function(snapshot) {
    let data = snapshot.val();
    if(data !== null) {
      setMidiDeviceFromName(data.name, data.channel);
    }
  })
}

export function saveUserRemotePreset(remote_id, version, name, controlValues) {
  let {user} = authenication.getState();
  let path_list = ['public', 'users', user.uid, remote_id, version, 'presets'];
  firebase.database().ref(path_list.join('/')).push({name: name, controlValues: controlValues})
}

export function getUserRemotePresets() {
  let {user} = authenication.getState();
  let {remote_id, version} = activesynthremote.getState();
  let path_list = ['public', 'users', user.uid, remote_id, version, 'presets'];
  firebase.database().ref(path_list.join('/')).on('value', function (snapshot) {
    let presets = [];
    snapshot.forEach(function(child) {
      presets.push({...child.val(), key:child.key})
    });
    activesynthremote.setSynthRemotePresets(presets);
  })
}