/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'

export default Component({
  handleListChange(event) {
    event.preventDefault();
    let {value} = event.target;
    if(this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function") {
      this.props.onValueChange(value);
    }
  },

  render() {
    let {control, controlValues} = this.props;
    let options = [];
    control.options.forEach(item => options.push(item));
    return (
      <div className="drop-down-box">
        <select
          id={control.key}
          className="drop-down-select"
          value={controlValues[control.key]}
          onChange={this.handleListChange}
        >
          <option disabled value="">select</option>
          {
            options.map(item => (
              <option
                className="drop-down-option"
                key={'option_' + item.value}
                value={item.value}
              >{item.name}</option>
            ))
          }
        </select>
      </div>
    )
  }
}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}));