/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import Selector from '../input/arrayselector'
import synthpanels from '../../state/synthpanels'
import {getSysExHeaderFromManufacturerId} from '../../state/sysexheaders'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../../pojos/constants'
import {getSynthRemote} from '../../state/synthremotes'

export default Component({


  render() {
    let isSysEx = this.props.selectedType === CONTROLTYPE.SYSEX.toString();
    return (
      <form className="form-horizontal">
        <Selector
          id="typeSelector"
          value={this.props.selectedType}
          data={this.props.controlTypes}
          label="Controller Type"
          default_text="Select controller type"
          eventhandler={(event) => synthpanels.setSelectedType(event.target.value)}
          />
        <Selector
          id="subtypeSelector"
          value={this.props.selectedSubType}
          data={this.props.controlSubTypes}
          label="Controller Sub-Type"
          default_text="Select sub-controller type"
          eventhandler={(event) => synthpanels.setSelectedSubType(event.target.value)}
        />
        {isSysEx ? <SysExFormExtra params={this.props.params} /> : ''}
        <button className="btn btn-default">Add Controller</button>
      </form>
    )
  }
}, (state) => ({
  controlName: state.synthpanels.synthpanel,
  controlTypes: state.controltypes.types,
  controlSubTypes: state.controltypes.subtypes,
  selectedType: state.synthpanels.selectedType,
  selectedSubType: state.synthpanels.selectedSubType
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
        eventhandler={(event) => synthpanels.setSelectedSysExHeader(event.target.value)}

      />
    </div>
   )
  }
}, (state) => ({
  manufacturerId: state.synthremotes.synthremote.manufacturer_id,
  selectedSysExHeader: state.synthpanels.selectedSysExHeader,
  compatibleSysExHeaders: state.sysexheaders.compatibleSysExHeaders,
}));