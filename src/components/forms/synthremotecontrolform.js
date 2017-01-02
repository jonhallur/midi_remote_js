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

export default Component({
  componentDidMount() {

    getSynthRemote(this.props.params.remote_id);
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


