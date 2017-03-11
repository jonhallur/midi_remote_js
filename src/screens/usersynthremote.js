/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import '../pojos/jquery-knob'
import activeSynthRemote, {sendSysExData, sendCCData, sendM1000ModData} from '../state/activesynthremote'
import ReactKnob from '../components/midicontrols/jknob'
import ListControl from '../components/midicontrols/dropdown'
import Toggle from '../components/midicontrols/toggle'
import BitMask from '../components/midicontrols/bitmask'
import M1000Mod from '../components/midicontrols/m1000mod'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'
import ActiveSynthModal from '../components/modals/activesynthremotemodal'
import activesynthremote from '../state/activesynthremote'
import {getUserSynthRemote} from "../state/synthremotes";

export default Component({
  componentDidMount() {
    activesynthremote.setLoading();
    getUserSynthRemote(this.props.params.remote_id, 'public/synthremotes/')
  },
  render() {
    return (
      <div>
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
    let {panel, showPanel, id, panelWidth} = this.props;
    return (
      <div className={"col-lg-" +  panelWidth}>
        <div className="panel panel-default" id={panel.key}>
          <div className="panel-heading panel-heading-overrides" onClick={e => activeSynthRemote.togglePanel(panel.key)}>
            <h3 className="panel-title">{panel.name}
            <div className="float-right">
                <span
                  className={showPanel[panel.key] ? "glyphicon glyphicon-triangle-bottom" : "glyphicon glyphicon-triangle-left"}
                  aria-hidden="true"

                />
            </div>
            </h3>
          </div>
          <div className={showPanel[panel.key] ? "panel-body-overrides panel-body" : "collapse"} id={'panel_' + id}>
            {panel.controls.map((control) => (
              <div className={Number(control.subtype) === SUBCONTROLTYPE.M1000MOD ? "m1000-control-box" : "midi-control-box"}  key={control.key}>
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
  showPanel: state.activesynthremote.showPanel,
  panelWidth: state.activesynthremote.panelWidth,
}));

const ControlDelegator = Component({
  handleOnValueChange(value) {
    let {key, sysexheaderid, parameter, type, subtype, path} = this.props.control;
    activeSynthRemote.setControlValues({uuid: key, value: value});
    if(sysexheaderid) {
      if(Number(subtype) === SUBCONTROLTYPE.M1000MOD) {
        sendM1000ModData(sysexheaderid, path, value, key);
      }
      else {
        sendSysExData(sysexheaderid, parameter, value, key);
      }

    }
    else if(Number(type) === CONTROLTYPE.CC) {
      sendCCData(parameter, value, key);
    }

  },

  render() {
    let {index, control,controlValues} = this.props;
    let {type, subtype} = control;
    let control_map = {
        [SUBCONTROLTYPE.RANGE]: <ReactKnob key={control.key} control={control} value={controlValues[control.key]} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.LIST]: <ListControl key={control.key} control={control} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.TOGGLE]: <Toggle key={control.key} control={control} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.BITMASK]: <BitMask key={control.key} control={control} onValueChange={this.handleOnValueChange}/>,
        [SUBCONTROLTYPE.M1000MOD]: <M1000Mod key={control.key} control={control} onValueChange={this.handleOnValueChange}/>
    };
    return control_map[subtype];
  }
}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}));
