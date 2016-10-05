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

export const CONTROLTYPE = {SYSEX: 0, CC: 1, NRPN: 2, OSC: 3};
export const SUBCONTROLTYPE = {RANGE: 0, TOGGLE: 1, LIST: 2, BITMASK: 3};
