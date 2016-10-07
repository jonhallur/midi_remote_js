/**
 * Created by jonh on 6.10.2016.
 */
import firebase from 'firebase'

export function addToCollection(pathList, data) {
  var ref = firebase.database().ref(pathList.join('/'));
  ref.once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      let collection = [];
      snapshot.val().forEach(item => collection.push(item));
      collection.push(data);
      ref.set(collection);
    }
    else {
      ref.set([data]);
    }
  });
}

export function swapCollectionItemsByIndex(pathList, source_index, target_index) {
  var ref = firebase.database().ref(pathList.join('/'));
  ref.once('value').then(function(snapshot) {
    if(snapshot.exists()) {
      var collection = [];
      snapshot.val().forEach(item => collection.push(item));
      let temp = collection[source_index];
      collection[source_index] = collection[target_index];
      collection[target_index] = temp;
      ref.set(collection);
    }
  })
}

export function removeFromCollectionByIndex(pathList, index) {
  console.log("remove", pathList, index);
  var ref = firebase.database().ref(pathList.join('/'));
  ref.once('value').then(function(snapshot) {
    if(snapshot.exists()) {
      console.log("found snapshot");
      var collection = [];
      snapshot.val().forEach(item => collection.push(item));
      collection.splice(index, 1);
      ref.set(collection);
    }
  })
}