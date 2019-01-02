/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import Selector from '../input/arrayselector'
import midicontrols from '../../state/midicontrols'
import {getSysExHeaderFromManufacturerId} from '../../state/sysexheaders'
import {getSynthRemote} from '../../state/synthremotes'
import {CONTROLTYPE, SUBCONTROLTYPE} from '../../pojos/constants'
import RangeForm from './rangecontrolform'
import ToggleForm from './sysextogglecontrolform'
import ListForm from './sysexlistcontrolform'
import BitMaskForm from './sysexbitmaskcontrolform'
import M1000ModForm from './m1000modform'
import {addToCollection} from "../../state/genericfirebase";
import {NotificationManager} from 'react-notifications'
import * as _ from "lodash";


function addTsvControl (lines, params) {
  let line = lines.shift();
  let [default_value, maximum, minimum, name, parameter, short, subtype, sysexheaderid, type, signed] = line.split('\t');
  let data = {
    name,
    short,
    default: default_value,
    type,
    subtype
  };

  //Add type specific Data
  if(Number(type) === CONTROLTYPE.SYSEX) {
    data = {...data, sysexheaderid}
  }
  if(type in [CONTROLTYPE.CC, CONTROLTYPE.SYSEX, CONTROLTYPE.NRPN]) {
    data = {...data, parameter}
  }

  //Add subtype specific Data
  if (Number(subtype) === SUBCONTROLTYPE.RANGE) {
    data = {...data, minimum, maximum};
  }
  else if (Number(subtype) === SUBCONTROLTYPE.TOGGLE) {
    data = {...data, onvalue: maximum, offvalue: minimum}
  }
  else if (Number(subtype) === SUBCONTROLTYPE.LIST) {
    let nameValueList = _.zipWith(
      maximum.split(','),
      minimum.split(','),
      (name, value) => (
        {name, value}
      )
    );
    data = {...data, options: nameValueList}
  }
  else if (Number(subtype) === SUBCONTROLTYPE.BITMASK) {
    data = {...data, numbits: maximum}
  }
  else if(Number(subtype) === SUBCONTROLTYPE.M1000MOD || Number(subtype) === SUBCONTROLTYPE.SHRUTHIMOD) {
    data = {...data, path: parameter, minimum, maximum, default: default_value.split(',')};
  }
  else if(Number(subtype) === SUBCONTROLTYPE.NOTERANGE) {
    data = {...data, minimum, maximum, midiNoteName:true};
  }
  else if(Number(subtype) === SUBCONTROLTYPE.ASCII) {
    data = {...data, default: default_value.split(','), first: minimum, last: maximum}
  }
  else {
    console.log(subtype);
    throw Error("Unknown subtype");
  }

  //Matrix 1000 signed number format
  if(Number(signed) > 0) {
    data = {...data, signed}
  }

  console.log("adding ", data);
  let pathList = ['admin', 'synthremotes', params.remote_id, 'panels', params.panel_id, 'controls'];
  addToCollection(pathList, data);
  setTimeout(() => {
    if(lines.length !==0) {
      addTsvControl(lines, params)
    }
    else {
      NotificationManager.info("Done Importing", "TSV Importer")
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
    let {selectedType, selectedSubType} = this.props;
    let isSysEx = selectedType === CONTROLTYPE.SYSEX.toString();

    let inputsFromSubType = {
      [SUBCONTROLTYPE.RANGE]: (<RangeForm params={this.props.params} />),
      [SUBCONTROLTYPE.TOGGLE]: (<ToggleForm params={this.props.params} />),
      [SUBCONTROLTYPE.LIST]: (<ListForm params={this.props.params} />),
      [SUBCONTROLTYPE.BITMASK]: (<BitMaskForm params={this.props.params} />),
      [SUBCONTROLTYPE.M1000MOD]: (<M1000ModForm params={this.props.params} />),
      [SUBCONTROLTYPE.NOTERANGE]: (<RangeForm params={this.props.params} />),
      [SUBCONTROLTYPE.ASCII]: <RangeForm params={this.props.params}/>,
      [SUBCONTROLTYPE.SHRUTHIMOD]: (<M1000ModForm params={this.props.params} />),
    };

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
        {inputsFromSubType[selectedSubType]}
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


