/**
 * Created by jonh on 22.10.2016.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'
import midicontrols from '../../state/midicontrols'
import _ from 'lodash'
import {addToCollection} from "../../state/genericfirebase";

export default Component({
  onAddBtnClick(event) {
    event.preventDefault();
    let field_list = ['name', 'short', 'parameter', 'numbits', 'default', 'sysexheaderid', 'type', 'subtype'];
    let data = _.pick(this.props, field_list);
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
    addToCollection(pathList, data);
    midicontrols.clearBitMaskInputs();
  },

  render () {
    let inputList = [
      this.props.name,
      this.props.short,
      this.props.parameter,
      this.props.numbits,
      this.props.default,
      this.props.sysexheaderid
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
          placeholder="Number of Bits"
          type="number"
          id="num_bits"
          value={this.props.numbits}
          onChange={(event) => midicontrols.setNumBits(event.target.value)}
        />
        <Input
          placeholder="Default Value"
          type="number"
          id="default"
          value={this.props.default}
          onChange={(event) => midicontrols.setDefault(event.target.value)}
        />

        <button className={showCreateButton ? "btn btn-default" : "hidden"} onClick={this.onAddBtnClick}>Add Bitmask</button>
      </div>
    )
}}, (state) => ({
  name: state.midicontrols.name,
  short: state.midicontrols.short,
  parameter: state.midicontrols.parameter,
  numbits: state.midicontrols.numBits,
  default: state.midicontrols.default,
  type: state.midicontrols.selectedType,
  subtype: state.midicontrols.selectedSubType,
  sysexheaderid: state.midicontrols.selectedSysExHeader
}))