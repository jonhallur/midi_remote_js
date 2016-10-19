/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import '../pojos/jquery-knob'
import {getSynthRemote} from '../state/synthremotes'
import {createActiveSynthRemote} from '../state/activesynthremote'
import MidiDevices from '../components/mididevices'
import JQueryKnob from '../components/midicontrols/rangeknob'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../pojos/constants'

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
      <div className="panel panel-default" id={this.props.id}>
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.panel.name}</h3>
        </div>
        <div className="panel-body">
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
});

const ControlDelegator = Component({
  render() {
    let {index, control} = this.props;
    let {type, subtype} = control;
    let control_map = {
      [CONTROLTYPE.SYSEX]: {
      [SUBCONTROLTYPE.RANGE]: <JQueryKnob key={'knob_' + index} index={index} control={control} />,
        [SUBCONTROLTYPE.LIST]: <ListControl key={'list_' + index} index={index} control={control} />
      }
    };
    return control_map[type][subtype];
  }
});

const ListControl = Component({
  render() {
    let {control} = this.props;
    let options = [];
    control.options.forEach(item => options.push(item));
    return (
      <div className="drop-down-box">
        <select className="drop-down-select">
          <option disabled value="">select</option>
          {
            options.map(item => (
              <option className="drop-down-option" key={'option_' + item.value} value={item.value}>{item.name}</option>
            ))
          }
        </select>
      </div>
    )
  }
});