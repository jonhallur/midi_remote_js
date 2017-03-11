/**
 * Created by jonh on 10.3.2017.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'
import midicontrols from '../../state/midicontrols'
import {addToCollection} from "../../state/genericfirebase";

export default Component({
  onAddBtnClick(event) {
    event.preventDefault();
    let {type, subtype, name, short, path, sysexheaderid} = this.props;
    let data = { name, short, path, type, subtype, sysexheaderid };
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
    addToCollection(pathList, data);
    midicontrols.clearM1000ModInputs();
  },

  render() {
    let {type, name, short, path} = this.props;
    let inputList = [name, short, path ];
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
          placeholder="Path Number"
          type="number"
          id="parameter_path"
          value={this.props.path}
          onChange={(event) => midicontrols.setUsingKeyValue({key: 'path', value: event.target.value})}
        />
        <button className={showCreateButton ? "btn btn-default" : "hidden"} onClick={this.onAddBtnClick}>Add Range</button>
      </div>
    )
  }
}, (state) => ({
  name: state.midicontrols.name,
  short: state.midicontrols.short,
  path: state.midicontrols.path,
  type: state.midicontrols.selectedType,
  subtype: state.midicontrols.selectedSubType,
  sysexheaderid: state.midicontrols.selectedSysExHeader,
}))