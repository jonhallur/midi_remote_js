/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import Selector from '../input/arrayselector'
import midicontrols from '../../state/midicontrols'
import {getSysExHeaderFromManufacturerId} from '../../state/sysexheaders'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../../pojos/constants'
import {getSynthRemote} from '../../state/synthremotes'
import RangeForm from './sysexrangecontrolform'
import ToggleForm from './sysextogglecontrolform'
import ListForm from './sysexlistcontrolform'
import BitMaskForm from './sysexbitmaskcontrolform'
import * as _ from "lodash";
import {addToCollection} from "../../state/genericfirebase";


function addTsvControl (lines, params) {
  let line = lines.shift();
  let [default_value, maximum, minimum, name, parameter, short, subtype, sysexheaderid, type] = line.split('\t');
  let data = {
    name: name,
    short: short,
    parameter: parameter,
    default: default_value,
    sysexheaderid: sysexheaderid,
    type: type,
    subtype: subtype
  };
  if (Number(subtype) === 0) {
    Object.assign(data, {minimum: minimum, maximum: maximum,})
  }
  else if (Number(subtype) === 1) {
    Object.assign(data, {onvalue: maximum, offvalue: minimum})
  }
  else if (Number(subtype) === 2) {
    let nameValueList = _.zipWith(
      maximum.split(','),
      minimum.split(','),
      (name, value) => (
      {name: name, value: value}
      )
    );
    Object.assign(data, {options: nameValueList})
  }
  else if (Number(subtype) === 3) {
    Object.assign(data, {numbits: maximum})
  }
  else {
    console.log(subtype);
    throw Error("Unknown subtype");
  }
  console.log("adding ", data);
  let {remote_id, panel_id} = params;
  let pathList = ['admin', 'synthremotes', remote_id, 'panels', panel_id, 'controls'];
  addToCollection(pathList, data);
  setTimeout(() => {
    if(lines.length !==0) {
      addTsvControl(lines, params)
    }
  }, 500);
}

export default Component({
  componentDidMount() {
    getSynthRemote(this.props.params.remote_id);
  },


  onFileInputChange(event) {
    event.preventDefault();
    let params = this.props.params;
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (function(aFile) {
        let lines = aFile.target.result.split('\r\n');
        lines.shift();
        addTsvControl(lines, params);
      });
      reader.readAsText(file);
    }
  },

  render() {
    let isSysEx = this.props.selectedType === CONTROLTYPE.SYSEX.toString();
    let isRange = this.props.selectedSubType === SUBCONTROLTYPE.RANGE.toString();
    let isToggle = this.props.selectedSubType === SUBCONTROLTYPE.TOGGLE.toString();
    let isList = this.props.selectedSubType === SUBCONTROLTYPE.LIST.toString();
    let isBitMask = this.props.selectedSubType === SUBCONTROLTYPE.BITMASK.toString();
    return (
      <form className="form-horizontal">
        <Selector
          id="typeSelector"
          value={this.props.selectedType}
          data={this.props.controlTypes}
          label="Controller Type"
          default_text="Select controller type"
          eventhandler={(event) => midicontrols.setSelectedType(event.target.value)}
          />
        {isSysEx ? <SysExFormExtra params={this.props.params} /> : ''}
        <Selector
          id="subtypeSelector"
          value={this.props.selectedSubType}
          data={this.props.controlSubTypes}
          label="Controller Sub-Type"
          default_text="Select sub-controller type"
          eventhandler={(event) => midicontrols.setSelectedSubType(event.target.value)}
        />
        {isRange ? <RangeForm params={this.props.params} /> : '' }
        {isToggle ? <ToggleForm params={this.props.params} /> : '' }
        {isList ? <ListForm params={this.props.params} /> : '' }
        {isBitMask ? <BitMaskForm params={this.props.params} /> : '' }
        <input type="file" name="tsv" accept="text/tsv+tsv" onChange={this.onFileInputChange} />
        <span>Select .tsv file</span>
      </form>
    )
  }
}, (state) => ({

  controlTypes: state.midicontrols.types,
  controlSubTypes: state.midicontrols.subtypes,
  selectedType: state.midicontrols.selectedType,
  selectedSubType: state.midicontrols.selectedSubType
}));

const SysExFormExtra = Component({
  componentDidMount() {
    if (this.props.manufacturerId) {
      getSysExHeaderFromManufacturerId(this.props.manufacturerId);
    }
  },

  render() {
  return (
    <div>
      <Selector
        id="compatibleSysExHeaders"
        value={this.props.selectedSysExHeader}
        data={this.props.compatibleSysExHeaders}
        label="Available SysExHeaders"
        default_text="Select SysEx Header"
        eventhandler={(event) => midicontrols.setSelectedSysExHeader(event.target.value)}
      />
    </div>
   )
  }
}, (state) => ({
  selectedSysExHeader: state.midicontrols.selectedSysExHeader,
  compatibleSysExHeaders: state.sysexheaders.compatibleSysExHeaders,
  manufacturerId: state.synthremotes.synthremote.manufacturer_id
}));


