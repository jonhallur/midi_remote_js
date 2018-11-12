/**
 * Created by jonh on 22.10.2016.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'
import {addToCollection} from "../../state/genericfirebase";
import midicontrols from '../../state/midicontrols'
import {createRangeControlData} from "../../pojos/common_controls";
import {CONTROLTYPE} from '../../pojos/constants'

const COMMON_MIDI_Input = (props) => (
  <Input
    placeholder="Parameter Number"
    type="number"
    id="parameter_number"
    value={props.parameter}
    onChange={(event) => midicontrols.setParameter(event.target.value)}
  />
);

const NRPN_Input = (props) => (
  <div className="alert-danger">
    Not implemented, please don't use
  </div>
);

const OSC_Input = (props) => (
  <div className="alert-danger">
    Not implemented, please don't use
  </div>
);


export default Component({
  onAddBtnClick(event) {
    event.preventDefault();
    let data = createRangeControlData(this.props);
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
    addToCollection(pathList, data);
    midicontrols.clearRangeInputs();
  },

  render() {
    let inputList = [
      this.props.name,
      this.props.short,
      this.props.parameter,
      this.props.minimum,
      this.props.maximum,
      this.props.default
    ];
    let {type} = this.props;
    let showCreateButton = inputList.reduce(function(a,b) {return a && b});
    let parameterInput = type in [CONTROLTYPE.CC, CONTROLTYPE.SYSEX, CONTROLTYPE.NRPN] ? ( <COMMON_MIDI_Input props={this.props} /> ) : '';
    let oscInput = Number(type) === CONTROLTYPE.OSC ? ( <OSC_Input props={this.props} /> ) : '';

    return (
      <div>
        <Input
          placeholder="Parameter Name"
          type="text"
          id="parameter_name"
          value={this.props.name}
          onChange={(event) => midicontrols.setName(event.target.value)}
        />
        <Input
          placeholder="Short Name"
          type="text"
          id="short_name"
          value={this.props.short}
          onChange={(event) => midicontrols.setShort(event.target.value)}
        />
        <Input
          placeholder="Minimum Value"
          type="number"
          id="parameter_minimum"
          value={this.props.minimum}
          onChange={(event) => midicontrols.setMinimum(event.target.value)}
        />
        <Input
          placeholder="Maximum Value"
          type="number"
          id="parameter_maximum"
          value={this.props.maximum}
          onChange={(event) => midicontrols.setMaximum(event.target.value)}
        />
        <Input
          placeholder="Default Value"
          type="number"
          id="parameter_default"
          value={this.props.default}
          onChange={(event) => midicontrols.setDefault(event.target.value)}
        />
        { parameterInput }
        { oscInput }

        <button className={showCreateButton ? "btn btn-default" : "hidden"} onClick={this.onAddBtnClick}>Add Range</button>

      </div>
    )
  }
}, (state) => ({
  name: state.midicontrols.name,
  short: state.midicontrols.short,
  parameter: state.midicontrols.parameter,
  minimum: state.midicontrols.minimum,
  maximum: state.midicontrols.maximum,
  default: state.midicontrols.default,
  type: state.midicontrols.selectedType,
  subtype: state.midicontrols.selectedSubType,
  sysexheaderid: state.midicontrols.selectedSysExHeader,
}));