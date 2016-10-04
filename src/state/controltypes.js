/**
 * Created by jonhallur on 04/10/16.
 */
import {State} from 'jumpsuit'
import {CONTROLTYPE} from '../pojos/constants'

const controlTypes = State('controltypes', {
    initial: {
        types: [
            {value: CONTROLTYPE.SYSEX, name: 'System Exclusive'},
            {value: CONTROLTYPE.CC, name: 'Continuous Controller'},
            {value: CONTROLTYPE.NRPN, name: 'Non-Registered Parameter Number'}
        ]
    }
});

export default controlTypes