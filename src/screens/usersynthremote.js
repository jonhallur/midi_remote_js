/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import {getSynthRemote} from '../state/synthremotes'
import activeSynthRemote, {createActiveSynthRemote, sendSysExData} from '../state/activesynthremote'
import jQuery from 'jquery'
import '../pojos/jquery-knob'
import MidiDevices from '../components/mididevices'

export default Component({
  componentDidMount() {
    getSynthRemote(this.props.params.remote_id);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.synthremote.name === '') {
      createActiveSynthRemote(nextProps.synthremote);
    }
  },

  render() {
    return (
      <div>
        <MidiDevices/>
        <h2>UserSynthRemote {this.props.synthremote.name}</h2>
        {this.props.panels.map((panel, index) => (
          <Panel key={index} id={index} panel={panel} />
        ))}
      </div>
    )
  }
}, (state) => ({
  synthremote: state.synthremotes.synthremote,
  sysexheaders: state.activesynthremote.sysexheaders,
  panels: state.activesynthremote.panels
}))

const Panel = Component({
  render() {
    let panel_key = this.props.id;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.panel.name}</h3>
        </div>
        <div className="panel-body">
          {this.props.panel.controls.map((control, index) => (
            <Control key={index} index={index} control={control} id={panel_key} />
          ))}
        </div>
      </div>
    )
  }
});

const Control = Component({
  componentDidMount() {
    jQuery('.dial').knob({
      'release': function (v) {
        let knob = this.$[0];
        let control_id = knob.id;
        let param_num = jQuery(knob).attr('data-param-num');
        let sysex_id = jQuery(knob).attr('data-sysex-id');
        activeSynthRemote.setControlValues({uuid: control_id, value: v});
        sendSysExData(sysex_id, param_num, v)

      }
    });
  },

  handleKnobChange(parameter, event) {
    console.log(parameter, event);
  },

  render() {
    return (
      <div className="midi-control-box">
        <div className="midi-control-label">
          <p>{this.props.control.short}</p>
        </div>
        <div className="dial-box">
          <input
            type="text"
            className="dial"
            value={this.props.control.default}
            onChange={event => this.handleKnobChange(this.props.control.parameter, this.props.index)}
            id={this.props.control.key}
            title={this.props.control.name}
            data-sysex-id={this.props.control.sysexheaderid}
            data-param-num={this.props.control.parameter}
            data-width="60"
            data-height="60"
            data-fgColor="#66CC66"
            data-angleOffset="-135"
            data-angleArc="270"
            data-thickness="0.55"
            data-skin="tron"
            data-min={this.props.control.min}
            data-max={this.props.control.max}
          />
        </div>
      </div>

    )
  }
});