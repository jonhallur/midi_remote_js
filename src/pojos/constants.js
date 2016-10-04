/**
 * Created by jonhallur on 04/10/16.
 */

const SYSEX = Symbol('sysex');
const CC = Symbol('cc');
const OSC = Symbol('osc');
const NRPN = Symbol('nrpn');

export const CONTROLTYPE = {SYSEX, CC, OSC, NRPN};
