/**
 * Created by jonh on 23.10.2016.
 */
import {Component} from 'jumpsuit'

export default Component({
  handleCheckBoxClick(event) {
    let id = event.target.id;
    let {key} = this.props.control;
    let currentValue = this.props.controlValues[key];
    let currentCheckbox = event.target.checked;
    let value = currentCheckbox ? Number(currentValue) | (1 << id) : Number(currentValue) ^ (1 << id);
    if(this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function") {
      this.props.onValueChange(value);
    }
  },

  render () {
    let {control, controlValues} = this.props;
    let bitArray = [...Array(Number(control.numbits)).keys()];
    bitArray.reverse();
    return (
      <div className="bit-mask-box">
        {
          bitArray.map(index => (
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