/**
 * Created by jonh on 22.10.2016.
 */
import {Component} from 'jumpsuit'
import {addToCollection} from "../../state/genericfirebase";
import midicontrols from '../../state/midicontrols'
import Input from '../input/input'
export default Component({
  onAddBtnClick(event) {
    event.preventDefault();
    let controlType = this.props.selectedType;
    let controlSubType = this.props.selectedSubType;
    let data = {
      name: this.props.name,
      short: this.props.short,
      parameter: this.props.parameter,
      onvalue: this.props.onValue,
      offvalue: this.props.offValue,
      default: this.props.defaultToggle,
      sysexheaderid: this.props.selectedSysExHeader,
      type: controlType,
      subtype: controlSubType
    };
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
    addToCollection(pathList, data);
    midicontrols.clearToggleInputs();
  },

  render() {
    let inputList = [
      this.props.name,
      this.props.short,
      this.props.parameter,
      this.props.onValue,
      this.props.offValue,
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
          placeholder="Off Value"
          type="number"
          id="off_value"
          value={this.props.offValue}
          onChange={(event) => midicontrols.setOffValue(event.target.value)}
        />
        <Input
          placeholder="On Value"
          type="number"
          id="on_value"
          value={this.props.onValue}
          onChange={(event) => midicontrols.setOnValue(event.target.value)}
        />
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-10">
            <button
              type="button"
              className={this.props.defaultToggle ? 'btn btn-primary' : 'btn btn-default'}
              onClick={event => midicontrols.setDefaultToggle(!this.props.defaultToggle)}
            >{this.props.defaultToggle ? 'Default On' : 'Default Off'}
            </button>
          </div>
        </div>

        <button className={showCreateButton ? "btn btn-default" : "hidden"} onClick={this.onAddBtnClick}>Add Toggle</button>
      </div>
    )
  }
}, (state) => ({
  name: state.midicontrols.name,
  short: state.midicontrols.short,
  parameter: state.midicontrols.parameter,
  onValue: state.midicontrols.onValue,
  offValue: state.midicontrols.offValue,
  defaultToggle: state.midicontrols.defaultToggle,
  selectedType: state.midicontrols.selectedType,
  selectedSubType: state.midicontrols.selectedSubType,
  selectedSysExHeader: state.midicontrols.selectedSysExHeader,
}));

