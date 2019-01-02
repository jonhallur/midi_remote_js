/**
 * Created by jonh on 10.3.2017.
 */
import {Component} from 'jumpsuit'
import Knob from './jknob'

var SourceOptions = {
    "4": [
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
    ],
    "7": [
      "lfo 1",
      "lfo 2",
      "stpseq",
      "stpsq1",
      "stpsq2",
      "arp",
      "mwheel",
      "afttch",
      "bender",
      "offset",
      "cv 1",
      "cv 2",
      "cv 3",
      "cv 4",
      "cc A",
      "cc B",
      "breath",
      "pedal",
      "noise",
      "env 1",
      "env 2",
      "velo",
      "random",
      "note",
      "gate",
      "audio",
      "op. 1",
      "op. 2"
    ]
  };

var DestinationOptions = {
  "4": [
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
  ],
  "7": [
    "cutoff",
    "vca",
    "pwm1",
    "pwm2",
    "osc1",
    "osc2",
    "osc1+2",
    "fine",
    "mix",
    "noise",
    "subosc",
    "reso",
    "cv 1",
    "cv 2",
    "atk1+2",
    "lfo 1",
    "lfo 2",
    "trg e1",
    "trg e2",
    "atk. 1",
    "dec. 1",
    "sus. 1",
    "rel. 1",
    "atk. 2",
    "dec. 2",
    "sus. 2",
    "rel. 2"
  ]
};

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

  onSourceWheel(event) {
    let direction = event.nativeEvent.deltaY;
    let {control, controlValues} = this.props;
    let options = SourceOptions[control.subtype];
    let length = options.length;
    let [sourceValue, destinationValue, amount] = controlValues[control.key] || [0,0,0];
    let currentIndex = Number(sourceValue);
    event.preventDefault();
    if(direction < 0) {
      currentIndex--;
      if(currentIndex > -1) {
        this.updateValue(currentIndex, destinationValue, amount)
      }
    }
    else if(direction > 0) {
      currentIndex++;
      if(currentIndex < length) {
        this.updateValue(currentIndex, destinationValue, amount)
      }
    }
  },

  onDestinationWheel(event) {
    let direction = event.nativeEvent.deltaY;
    let {control, controlValues} = this.props;
    let options = DestinationOptions[control.subtype];
    let length = options.length;
    let [sourceValue, destinationValue, amount] = controlValues[control.key] || [0,0,0];
    let currentIndex = Number(destinationValue);
    event.preventDefault();
    if(direction < 0) {
      currentIndex--;
      if(currentIndex > -1) {
        this.updateValue(sourceValue, currentIndex, amount)
      }
    }
    else if(direction > 0) {
      currentIndex++;
      if(currentIndex < length) {
        this.updateValue(sourceValue, currentIndex, amount)
      }
    }
  },

  render () {
    let {control, controlValues} = this.props;
    let [source, destination, amount] = controlValues[control.key] || [0,0,0];
    return (
      <div>
        <div style={{width: "77px", height: "74px", float: "left"}}>
          <select
          id={control.key}
          className="m1000-drop-down-select"
          value={source}
          onChange={this.handleSourceChange}
          onWheel={this.onSourceWheel}
        >
          <option disabled value="">Source</option>
          {
            SourceOptions[control.subtype].map((item, index) => (
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
            onWheel={this.onDestinationWheel}
          >
            <option disabled value="">Destination</option>
            {
              DestinationOptions[control.subtype].map((item, index) => (
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