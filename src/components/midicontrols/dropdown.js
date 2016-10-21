/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import '../../pojos/jquery-knob'
import activeSynthRemote, {sendSysExData} from '../../state/activesynthremote'
import jQuery from 'jquery'

export default Component({
  handleListChange(event) {
    event.preventDefault();
    let selector = event.target;
    let value = selector.value;
    let param_num = jQuery(selector).attr('data-param-num');
    let sysex_key = jQuery(selector).attr('data-sysex-id');

    let selector_key = selector.id;
    activeSynthRemote.setControlValues({uuid: selector_key, value: value});
    sendSysExData(sysex_key, param_num, value);

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
          data-param-num={control.parameter}
          data-sysex-id={control.sysexheaderid}
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