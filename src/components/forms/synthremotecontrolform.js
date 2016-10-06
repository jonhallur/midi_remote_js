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

export default Component({
  onAddControlBtnClick(event) {
    event.preventDefault();
    let controlType = this.props.selectedType;
    let controlSubType = this.props.selectedSubType;


  },
  addControl(type, subType) {

  },

  render() {
    let isSysEx = this.props.selectedType === CONTROLTYPE.SYSEX.toString();
    let isRange = this.props.selectedSubType === SUBCONTROLTYPE.RANGE.toString();
    let isToggle = this.props.selectedSubType === SUBCONTROLTYPE.TOGGLE.toString();
    let isList = this.props.selectedSubType === SUBCONTROLTYPE.LIST.toString();
    let showCreateButton = (this.props.selectedType !== '') && (this.props.selectedSubType !== '');
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
        <button className={showCreateButton ? "btn btn-default" : "hidden"} onClick={this.onAddControlBtnClick}>Add Controller</button>
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
    getSynthRemote(this.props.params.remote_id);
    if (this.props.manufacturerId) {
      console.log("has manid");
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
  manufacturerId: state.synthremotes.synthremote.manufacturer_id,
  selectedSysExHeader: state.synthpanels.selectedSysExHeader,
  compatibleSysExHeaders: state.sysexheaders.compatibleSysExHeaders,
}));

const RangeForm = Component({
  render() {
    return (
      <div>
        <Input
          placeholder="Parameter Name"
          type="text"
        />
        <Input
          placeholder="Parameter Number"
          type="number"
        />
        <Input
          placeholder="Minimum Value"
          type="number"
        />
        <Input
          placeholder="Maximum Value"
          type="number"
        />
        <Input
          placeholder="Default Value"
          type="number"
        />
      </div>
    )
  }
});

const ToggleForm = Component({
  render() {
    return (
      <div>
        <Input
          placeholder="Parameter Name"
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