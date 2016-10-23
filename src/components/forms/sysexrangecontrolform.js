/**
 * Created by jonh on 22.10.2016.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'
import {addToCollection} from "../../state/genericfirebase";
import midicontrols from '../../state/midicontrols'


export default Component({
  onAddBtnClick(event) {
    event.preventDefault();
    let controlType = this.props.selectedType;
    let controlSubType = this.props.selectedSubType;
    let data = {
      name: this.props.name,
      short: this.props.short,
      parameter: this.props.parameter,
      minimum: this.props.minimum,
      maximum: this.props.maximum,
      default: this.props.default,
      sysexheaderid: this.props.selectedSysExHeader,
      type: controlType,
      subtype: controlSubType
    };
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
    let showCreateButton = inputList.reduce(function(a,b) {return a && b});
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
          placeholder="Parameter Number"
          type="number"
          id="parameter_number"
          value={this.props.parameter}
          onChange={(event) => midicontrols.setParameter(event.target.value)}
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
  selectedType: state.midicontrols.selectedType,
  selectedSubType: state.midicontrols.selectedSubType,
  selectedSysExHeader: state.midicontrols.selectedSysExHeader,
}));