/**
 * Created by jonh on 20.10.2016.
 */
import {Component} from 'jumpsuit'
import Switch from 'rc-switch'

export default Component({
  handleToggleClick(toggleState) {
    let value = toggleState ? this.props.control.onvalue : this.props.control.offvalue;
    if(this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function") {
      this.props.onValueChange(Number(value));
    }
  },

  render() {
    let {control, controlValues} = this.props;
    return (
      <div className="toggle-box">
        <Switch
          checkedChildren={'On'}
          unCheckedChildren={'Off'}
          checked={Boolean(Number(controlValues[control.key]))}
          onChange={this.handleToggleClick}
        />
      </div>
    )
  }
}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}));
