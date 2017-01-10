/**
 * Created by jonhallur on 09/01/17.
 */
import {CONTROLTYPE} from './constants'

export function createRangeControlData(props) {
  let { type } = props;

  let data =  {
    name: props.name,
    short: props.short,
    minimum: props.minimum,
    maximum: props.maximum,
    default: props.default,
    type: props.default,
    subtype: props.subtype
  };

  if (type in [CONTROLTYPE.CC, CONTROLTYPE.SYSEX]) {
    Object.assign(data, {parameter: props.parameter})
  }
  if (type.toString() === CONTROLTYPE.SYSEX.toString()) {
    Object.assign(data, {sysexheaderid: props.sysexheaderid})
  }
  return data;
}
