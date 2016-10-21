/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import '../pojos/jquery-knob'
import {getSynthRemote} from '../state/synthremotes'
import activeSynthRemote, {createActiveSynthRemote, sendSysExData} from '../state/activesynthremote'
import MidiDevices from '../components/mididevices'
import JQueryKnob from '../components/midicontrols/rangeknob'
import ListControl from '../components/midicontrols/dropdown'
import Toggle from '../components/midicontrols/toggle'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import {NotificationManager} from 'react-notifications'
import jQuery from 'jquery'

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
    return (
      <div className="panel panel-default" id={this.props.panel.key}>
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.panel.name}
          <div className="badge float-right">
              <span
                className="glyphicon glyphicon-align-justify"
                aria-hidden="true"
                onClick={e => activeSynthRemote.togglePanel(this.props.panel.key)}
              />
          </div>
          </h3>
        </div>
        <div className={this.props.showPanel[this.props.panel.key] ? "panel-body" : "collapse"} id={'panel_' + this.props.id}>
          {this.props.panel.controls.map((control, index) => (
            <div className="midi-control-box"  key={'control_' + index}>
              <div className="midi-control-label">
                <p>{control.short}</p>
              </div>
              <ControlDelegator index={index} control={control} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}, (state) => ({
  showPanel: state.activesynthremote.showPanel
}));

const ControlDelegator = Component({
  render() {
    let {index, control} = this.props;
    let {type, subtype} = control;
    let control_map = {
      [CONTROLTYPE.SYSEX]: {
        [SUBCONTROLTYPE.RANGE]: <JQueryKnob key={index} index={index} control={control} />,
        [SUBCONTROLTYPE.LIST]: <ListControl key={index} index={index} control={control} />,
        [SUBCONTROLTYPE.TOGGLE]: <Toggle key={index} index={index} control={control} />
      }
    };
    return control_map[type][subtype];
  }
});
