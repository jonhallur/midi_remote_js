/**
 * Created by jonh on 10.3.2017.
 */
import {Component} from 'jumpsuit'

import Knob from './jknob'

var SourceOptions = [
  "Unused",
  "Env1",
  "Env2",
  "Env3",
  "LFO1",
  "LFO2",
  "Vibrato",
  "Ramp1",
  "Ramp2",
  "Keyboard",
  "Portamento",
  "Tracking Generator",
  "Keyboard Gate",
  "Velocity",
  "Release Velocity",
  "Channel Pressure",
  "Pedal 1",
  "Pedal 2",
  "Pitch Bend",
  "CC 2",
  "CC 3"
];

var DestinationOptions = [
  "Unused",
  "DCO 1 Freq",
  "DCO 1 PW",
  "DCO 1 Shape",
  "DCO 2 Freq",
  "DCO 2 PW",
  "DCO 2 Shape",
  "Mix Level",
  "VCF FM Amt",
  "VCF Freq",
  "VCF Reso",
  "VCA 1 Level",
  "VCA 2 Level",
  "Env1 Delay",
  "Env1 Attack",
  "Env1 Decay",
  "Env1 Release",
  "Env1 Amp",
  "Env2 Delay",
  "Env2 Attack",
  "Env2 Decay",
  "Env2 Release",
  "Env2 Amp",
  "Env3 Delay",
  "Env3 Attack",
  "Env3 Decay",
  "Env3 Release",
  "Env3 Amp",
  "LFO 1 Speed",
  "LFO 1 Amp",
  "LFO 2 Speed",
  "LFO 2 Amp",
  "Portamento Time",
];

export default Component({
  updateValue(source, destination, value) {
    if (this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function") {
      this.props.onValueChange([source, destination, value]);
    }
  },

  handleSourceChange(event) {
    event.preventDefault();
    let source = event.target.value;
    let {control, controlValues} = this.props;
    let [,destination, value] = controlValues[control.key] || [0,0,63];
    console.log(source, destination, value);
    this.updateValue(source, destination, value);
  },

  handleDestinationChange(event) {
    event.preventDefault();
    let destination = event.target.value;
    let {control, controlValues} = this.props;
    let [source, , value] = controlValues[control.key] || [0,0,63];
    this.updateValue(source, destination, value)
  },

  handleKnobValueChange(value) {
    let {control, controlValues} = this.props;
    let [source, destination, ] = controlValues[control.key] || [0,0,63];
    this.updateValue(source, destination, value)
  },


  render () {
    let {control, controlValues} = this.props;
    let [source, destination, amount] = controlValues[control.key] || [0,0,63];
    return (
      <div>
        <div style={{width: "77px", height: "74px", float: "left"}}>
          <select
          id={control.key}
          className="m1000-drop-down-select"
          value={source}
          onChange={this.handleSourceChange}
          onWheel={this.onWheel}
        >
          <option disabled value="">Source</option>
          {
            SourceOptions.map((item, index) => (
              <option
                className="drop-down-option"
                key={'option_' + index}
                value={index}
              >{item}</option>
            ))
          }
          </select>
          <select
            id={control.key}
            className="m1000-drop-down-select"
            value={destination}
            onChange={this.handleDestinationChange}
            onWheel={this.onWheel}
          >
            <option disabled value="">Destination</option>
            {
              DestinationOptions.map((item, index) => (
                <option
                  className="drop-down-option"
                  key={'option_' + index}
                  value={index}
                >{item}</option>
              ))
            }
          </select>
        </div>
        <div style={{width: "77px", height: "74px", float: "left", marginLeft: "2px"}}>
          <Knob control={{...control, minimum: -63, maximum: 63, default: 63}} value={amount} onValueChange={this.handleKnobValueChange}/>
        </div>
      </div>
    )
}}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}))