/**
 * Created by jonhallur on 04/10/16.
 */

const SYSEX = Symbol('sysex');
const CC = Symbol('cc');
const OSC = Symbol('osc');
const NRPN = Symbol('nrpn');

const RANGE = Symbol('range');
const TOGGLE = Symbol('toggle');
const LIST = Symbol('list');
const BITMASK = Symbol('bitmask');
const M1000MOD = Symbol('m1000mod');

export const EOX = 0xF7;
export const CONTROLTYPE = {SYSEX: 0, CC: 1, NRPN: 2, OSC: 3};
export const SUBCONTROLTYPE = {RANGE: 0, TOGGLE: 1, LIST: 2, BITMASK: 3, M1000MOD: 4, NOTERANGE: 5, ASCII: 6};

export const ITEMTYPE = {
  LISTROW: 'listrow'
};

export const NOTENAMES={
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B"
};

export const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};