/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import '../pojos/jquery-knob'
import synthremotes, {getSynthRemote, getUserRemotePresets} from '../state/synthremotes'
import activeSynthRemote, {sendSysExData} from '../state/activesynthremote'
import MidiDevices from '../components/mididevices'
import ReactKnob from '../components/midicontrols/jknob'
import ListControl from '../components/midicontrols/dropdown'
import Toggle from '../components/midicontrols/toggle'
import BitMask from '../components/midicontrols/bitmask'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import ActiveSynthModal from '../components/modals/activesynthremotemodal'
import activesynthremote from '../state/activesynthremote'
import Presets from '../components/presets'
import {getUserSynthRemote} from "../state/synthremotes";

export default Component({
  componentDidMount() {
    activesynthremote.setLoading();
    getUserSynthRemote(this.props.params.remote_id, 'public/synthremotes/')
  },
  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body">
            <MidiDevices/>
            <Presets/>
          </div>
        </div>
        {this.props.panels.map((panel, index) => (
            <Panel key={index} id={index} panel={panel} />
        ))}
        <ActiveSynthModal/>
      </div>
    )
  }
}, (state) => ({
  synthremote: state.synthremotes.synthremote,
  sysexheaders: state.activesynthremote.sysexheaders,
  panels: state.activesynthremote.panels,

}))

const Panel = Component({
  render() {
    let {panel, showPanel, id} = this.props;
    return (
      <div className={showPanel[panel.key] ? "col-lg-4" : "col-lg-2"}>
        <div className="panel panel-default" id={panel.key}>
          <div className="panel-heading">
            <h3 className="panel-title">{panel.name}
            <div className="badge float-right" onClick={e => activeSynthRemote.togglePanel(panel.key)}>
                <span
                  className={showPanel[panel.key] ? "glyphicon glyphicon-triangle-bottom" : "glyphicon glyphicon-triangle-left"}
                  aria-hidden="true"

                />
            </div>
            </h3>
          </div>
          <div className={showPanel[panel.key] ? "panel-body" : "collapse"} id={'panel_' + id}>
            {panel.controls.map((control) => (
              <div className="midi-control-box"  key={control.key}>
                <div className="midi-control-label">
                  <p>{control.short}</p>
                </div>
                <ControlDelegator control={control} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}, (state) => ({
  showPanel: state.activesynthremote.showPanel
}));

const ControlDelegator = Component({
  handleOnValueChange(value) {
    let {key, sysexheaderid, parameter} = this.props.control;
    activeSynthRemote.setControlValues({uuid: key, value: value});
    sendSysExData(sysexheaderid, parameter, value, key);
  },

  render() {
    let {index, control} = this.props;
    let {type, subtype} = control;
    let control_map = {
      [CONTROLTYPE.SYSEX]: {
        [SUBCONTROLTYPE.RANGE]: <ReactKnob key={control.key} index={index} control={control} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.LIST]: <ListControl key={control.key} index={index} control={control} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.TOGGLE]: <Toggle key={control.key} index={index} control={control} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.BITMASK]: <BitMask key={control.key} index={index} control={control} onValueChange={this.handleOnValueChange}/>
      }
    };
    return control_map[type][subtype];
  }
});
