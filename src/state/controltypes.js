/**
 * Created by jonhallur on 04/10/16.
 */
import {State} from 'jumpsuit'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'

const controlTypes = State('controltypes', {
    initial: {
        types: [
            {value: CONTROLTYPE.SYSEX, name: 'System Exclusive'},
            {value: CONTROLTYPE.CC, name: 'Continuous Controller'},
            {value: CONTROLTYPE.NRPN, name: 'Non-Registered Parameter Number'}
        ],
        subtypes: [
            {value: SUBCONTROLTYPE.RANGE, name: 'Range'},
            {value: SUBCONTROLTYPE.TOGGLE, name: 'Toggle'},
            {value: SUBCONTROLTYPE.LIST, name: 'List'},
            {value: SUBCONTROLTYPE.BITMASK, name: 'Bitmask'}
        ]
    }
});

export default controlTypes