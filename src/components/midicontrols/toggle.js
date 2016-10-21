/**
 * Created by jonh on 20.10.2016.
 */
import {Component} from 'jumpsuit'
import Switch from 'rc-switch'
import activeSynthRemote, {sendSysExData} from '../../state/activesynthremote'

export default Component({
  handleToggleClick(value) {
    let {key, parameter, sysexheaderid} = this.props.control;
    activeSynthRemote.setControlValues({uuid: key, value: value});
    sendSysExData(sysexheaderid, parameter, value);
  },

  render() {
    let {control, controlValues} = this.props;
    return (
      <div className="toggle-box">
        <Switch
          checkedChildren={'On'}
          unCheckedChildren={'Off'}
          checked={controlValues[control.key]}
          onChange={this.handleToggleClick}
        />
      </div>
    )
  }
}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}));
