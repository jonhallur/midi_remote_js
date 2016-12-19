/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import jQuery from 'jquery'
import '../../pojos/jquery-knob'
import activeSynthRemote, {sendSysExData} from '../../state/activesynthremote'
import _ from 'lodash'

const debouncedUpdateKnob = _.debounce((parameter, sysexheaderid, key, value) => {
  activeSynthRemote.setControlValues({uuid: key, value: value});
  sendSysExData(sysexheaderid, parameter, value);
  console.log(parameter, value);
}, 100);


export default Component({
  componentDidMount() {
    let {parameter, sysexheaderid, key} = this.props.control;
    jQuery('.dial_' + key).knob({
      'release': function (value) {
        debouncedUpdateKnob(parameter, sysexheaderid, key, value);
      }
    });
  },

  render() {
    return (
      <div className="dial-box">
        <input
          type="text"
          className={'dial_' + this.props.control.key}
          value={this.props.controlValues[this.props.control.key]}
          onChange={e => console.log("changes")}
          id={this.props.control.key}
          title={this.props.control.name}
          data-default-value={this.props.control.default}
          data-min={this.props.control.minimum}
          data-max={this.props.control.maximum}
          data-sysex-id={this.props.control.sysexheaderid}
          data-param-num={this.props.control.parameter}
          data-width="60"
          data-height="60"
          data-fgColor="#87d068"
          data-angleOffset="-135"
          data-angleArc="270"
          data-thickness="0.55"
          data-skin="tron"
        />
      </div>
    )
  }
}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}));