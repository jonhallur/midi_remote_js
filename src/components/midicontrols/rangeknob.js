/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import {NotificationManager} from 'react-notifications'
import jQuery from 'jquery'
import '../../pojos/jquery-knob'
import activeSynthRemote, {sendSysExData} from '../../state/activesynthremote'

export default Component({
  componentDidMount() {
    let _this = this;
    jQuery('.dial').knob({
      'release': function (v) {
        let knob = this.$[0];
        _this.handleKnobChange(knob, v);
      }
    });
  },

  handleKnobChange(knob, v) {
    let knob_key = knob.id;
    let param_num = jQuery(knob).attr('data-param-num');
    let sysex_key = jQuery(knob).attr('data-sysex-id');
    activeSynthRemote.setControlValues({uuid: knob_key, value: v});
    sendSysExData(sysex_key, param_num, v)
  },

  render() {

    return (
      <div className="dial-box">
        <input
          type="text"
          className="dial"
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