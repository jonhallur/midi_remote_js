/**
 * Created by jonh on 23.10.2016.
 */
import {Component} from 'jumpsuit'
import activesynthremote, {sendSysExData} from '../../state/activesynthremote'
import jQuery from 'jquery'

export default Component({
  handleCheckBoxClick(event) {
    let id = event.target.id;
    let {key, parameter, sysexheaderid} = this.props.control;
    let currentValue = this.props.controlValues[key];
    let currentCheckbox = event.target.checked;
    let value = currentCheckbox ? Number(currentValue) | (1 << id) : Number(currentValue) ^ (1 << id);
    activesynthremote.setControlValues({uuid: key, value: value});
    sendSysExData(sysexheaderid, parameter, value);


  },

  render () {
    let {control, controlValues} = this.props;
    return (
      <div className="bit-mask-box">
        {
          [...Array(Number(control.numbits)).keys()].map(index => (
            <input
              key={index}
              type="checkbox"
              id={index}
              checked={Boolean(Number(controlValues[control.key]) & Number((1 << index)))}
              onChange={this.handleCheckBoxClick}

            />
          ))
        }
      </div>
    )
}}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}))

/*

false false false
false true false
true false true
true true true

 */