/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import Selector from '../input/arrayselector'
import Input from '../input/input'
import CheckBox from '../input/checkbox'
import midicontrols from '../../state/midicontrols'
import {getSysExHeaderFromManufacturerId} from '../../state/sysexheaders'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../../pojos/constants'
import {getSynthRemote} from '../../state/synthremotes'
import {addToCollection} from '../../state/genericfirebase'

export default Component({
  componentDidMount() {
    getSynthRemote(this.props.params.remote_id);
  },

  render() {
    let isSysEx = this.props.selectedType === CONTROLTYPE.SYSEX.toString();
    let isRange = this.props.selectedSubType === SUBCONTROLTYPE.RANGE.toString();
    let isToggle = this.props.selectedSubType === SUBCONTROLTYPE.TOGGLE.toString();
    let isList = this.props.selectedSubType === SUBCONTROLTYPE.LIST.toString();
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
        <Selector
          id="subtypeSelector"
          value={this.props.selectedSubType}
          data={this.props.controlSubTypes}
          label="Controller Sub-Type"
          default_text="Select sub-controller type"
          eventhandler={(event) => midicontrols.setSelectedSubType(event.target.value)}
        />
        {isSysEx ? <SysExFormExtra params={this.props.params} /> : ''}
        {isRange ? <RangeForm params={this.props.params} /> : '' }
        {isToggle ? <ToggleForm params={this.props.params} /> : '' }
        {isList ? <ListForm params={this.props.params} /> : ''}
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
      getSysExHeaderFromManufacturerId(this.props.manufacturerId)

    }
  },

  render() {
  return (
    <div>
      <Selector
        id="compatibleSysExHeaders"
        value={this.props.selectedSysexHeader}
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

const RangeForm = Component({
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

const ToggleForm = Component({
  render() {
    return (
      <div>
        <Input
          placeholder="Parameter Name"
          type="text"
        />
        <Input
          placeholder="Short Name"
          type="text"
        />

        <Input
          placeholder="Parameter Number"
          type="number"
        />
        <Input
          placeholder="On Value"
          type="number"
        />
        <Input
          placeholder="Off Value"
          type="number"
        />
        <CheckBox
          label="Default Value"
          type="checkbox"
        />
      </div>
    )
  }
});

const ListForm = Component({
  render() {
    return (
      <div>
        <Input
          placeholder="Parameter Name"
          type="text"
        />
        <Input
          placeholder="Short Name"
          type="text"
        />
        <Input
          placeholder="Parameter Number"
          type="number"
        />
        <Input
          placeholder="Menu item list (comma separated)"
          type="text"
        />
        <Input
          placeholder="Menu value list (comma separated)"
          type="text"
        />
        <Input
          placeholder="Default Value (from 0 index)"
          type="number"
        />
      </div>
    )
  }
});