/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import _ from 'lodash'

export default Component({
  handleListChange(event) {
    event.preventDefault();
    let {value} = event.target;
    if(this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function") {
      this.props.onValueChange(value);
    }
  },

  onWheel(event) {
    let direction = event.nativeEvent.deltaY;
    let {control, controlValues} = this.props;
    let length = control.options.length;
    let currentValue = controlValues[control.key];
    let currentIndex = _.findIndex(control.options, {value: currentValue});
    console.log(currentValue, currentIndex)
    event.preventDefault();
    if(direction < 0) {
      currentIndex--;
      if(currentIndex > -1) {
        this.props.onValueChange(control.options[currentIndex].value);
      }
    }
    else if(direction > 0) {
      currentIndex++;
      if(currentIndex < length) {
        this.props.onValueChange(control.options[currentIndex].value);
      }
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
          onWheel={this.onWheel}
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