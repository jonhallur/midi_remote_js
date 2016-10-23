/**
 * Created by jonh on 22.10.2016.
 */
import {Component} from 'jumpsuit'
import {addToCollection} from "../../state/genericfirebase";
import midicontrols from '../../state/midicontrols'
import Input from '../input/input'
import _ from 'lodash'

export default Component({
  onAddBtnClick(event) {
    event.preventDefault();
    let controlType = this.props.selectedType;
    let controlSubType = this.props.selectedSubType;
    let nameValueList = _.zipWith(
      this.props.nameList.split(','),
      this.props.valueList.split(','),
      (name, value) => (
        {name: name, value: value}
        )
    );
    let data = {
      name: this.props.name,
      short: this.props.short,
      parameter: this.props.parameter,
      options: nameValueList,
      default: this.props.default,
      sysexheaderid: this.props.selectedSysExHeader,
      type: controlType,
      subtype: controlSubType
    };
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
    addToCollection(pathList, data);
    midicontrols.clearListInputs();
  },

  render() {
    let inputList = [
      this.props.name,
      this.props.short,
      this.props.parameter,
      this.props.nameList,
      this.props.valueList,
      this.props.default,
      this.props.selectedSysExHeader
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
          placeholder="Name list (comma separated)"
          type="text"
          id="name_list"
          value={this.props.nameList}
          onChange={event => midicontrols.setNameList(event.target.value)}
        />
        <Input
          placeholder="Value list (comma separated)"
          type="text"
          id="value_list"
          value={this.props.valueList}
          onChange={event => midicontrols.setValueList(event.target.value)}
        />
        <Input
          placeholder="Default Value (from 0 index)"
          type="number"
          id="parameter_default"
          value={this.props.default}
          onChange={(event) => midicontrols.setDefault(event.target.value)}
        />
        <button className={showCreateButton ? "btn btn-default" : "hidden"} onClick={this.onAddBtnClick}>Add List</button>
      </div>
    )
  }
}, (state) => ({
  name: state.midicontrols.name,
  short: state.midicontrols.short,
  parameter: state.midicontrols.parameter,
  nameList: state.midicontrols.nameList,
  valueList: state.midicontrols.valueList,
  default: state.midicontrols.default,
  selectedType: state.midicontrols.selectedType,
  selectedSubType: state.midicontrols.selectedSubType,
  selectedSysExHeader: state.midicontrols.selectedSysExHeader,
}));