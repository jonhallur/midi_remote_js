import {Component} from 'jumpsuit'
import ReactTooltip from 'react-tooltip'
import {NOTENAMES} from '../../pojos/constants'
const WIDTH = 74;
const HALF_WIDTH = Math.round(WIDTH/2);

function radians(degrees) {
  return degrees * Math.PI / 180
}

function degrees(radians) {
  return radians * 180 / Math.PI;
}

export default Component({
  componentDidMount () {
    let {maximum, minimum} = this.props.control;
    this.range = Number(maximum) + Math.abs(minimum);
    this.signedBits = 0;
    if(Number(minimum) < 0) {
      if (Number(minimum) === -(1<<5)+1) {
        this.signedBits = 6
      }
      else if (Number(minimum) === -(1<<6)+1) {
        this.signedBits = 7
      }
    }
    this.setDefaultValues()
  },

  componentWillReceiveProps(nextProps) {
    this.value = Number(nextProps.value);
    this.position = this.value / this.range;
    this.updateCanvas();
  },

  updateMidi() {
    if(this.value !== this.lastMidiValueSent) {
      if((this.props.onValueChange !== undefined) && (typeof this.props.onValueChange === "function")) {
        this.props.onValueChange(this.value);
        this.lastMidiValueSent = this.value;
      }
    }
  },

  updateCanvas() {
    if (this.value === this.lastValue) {
      return;
    }
    this.lastValue = this.value;
    let canvas = this.refs.canvas.getContext('2d');

    // calculate values we'll need later
    let lineWidth = (HALF_WIDTH/4) - 1;
    let centerxy = HALF_WIDTH;

    let margin = 5;
    let radius   = centerxy - (lineWidth / 2) - margin;

    // calculate arc angles
    let offset       = 125;
    let arc          = 290;
    let scale        = this.range; //max value normalized to be starting-value agnostic
    let value        = this.value; // normalized current value
    let fillFraction = value/scale;

    let startAngle   = radians(offset);
    let endAngle     = radians(offset + arc);
    let readingAngle = radians(offset + arc*fillFraction);

    // canvas settings
    canvas.lineWidth = lineWidth;
    canvas.lineCap = 'butt';

    // clear the canvas
    canvas.clearRect(0,0,WIDTH,WIDTH);

    // render the dial background (grey arc)
    canvas.beginPath();
    canvas.strokeStyle = "#eee";
    canvas.arc(centerxy, centerxy, radius, startAngle, endAngle, false);
    canvas.stroke();

    canvas.beginPath();
    canvas.strokeStyle = '#87d068';
    let start = startAngle;
    let end = readingAngle;
    let relativeValue = this.value + Number(this.props.control.minimum);
    if(this.props.control.minimum < 0) {
      if (relativeValue < 0) {
        start = end;
        end = Math.PI*(-0.5);
      }
      else {
        start = Math.PI*(1.5);
      }
    }
    canvas.arc(centerxy, centerxy, radius, start, end, false);
    canvas.stroke();

    //
    canvas.font = "18px sans-serif";

    let fillText = relativeValue.toString();
    if(this.props["midiNoteName"]) {
      let octave = parseInt(this.value / 12, 10);
      let noteNumber = this.value % 12;
      fillText = NOTENAMES[noteNumber] + octave.toString()
    }
    canvas.fillText(fillText, 35 - fillText.length*4.5, 42);
  },

  updatePosition(event) {
    event.preventDefault();
    let {layerX, layerY, clientX, clientY, target} = event.nativeEvent;
    let X = (clientX) - target.getBoundingClientRect().left;
    let Y = (clientY) - target.getBoundingClientRect().top;
    let localX = (layerX || X) - HALF_WIDTH;
    let localY = (layerY || Y) - HALF_WIDTH;
    let rad = Math.atan2(localX, localY);
    let position = rad / Math.PI / 2;
    let percentage = 0;
    if (position < 0) {
      if (position < -0.1)
        percentage = (Math.abs(position) - 0.1) * 1.25;
      else {
        percentage = 0;
      }
    }
    else {
      if (position > 0.1) {
        percentage = (0.9 - position) * 1.25;
      }
      else {
        percentage = 1;
      }
    }
    return percentage
  },

  scalePercentage(percentage) {
    return Math.round(percentage * this.range);
  },

  setDefaultValues () {
    this.value = Number(this.props.control.default) || 0;
    this.position = (this.value - this.props.control.minimum) / this.range;
    this.updateCanvas();
    this.lastValue = this.position;
  },
  
  onMouseMove(event) {
    if(this.mouseDown) {
      this.position = this.updatePosition(event);
      this.value = this.scalePercentage(this.position);
      this.updateCanvas();
      this.updateMidi();
    }
  },

  onMouseUp(event) {
    event.preventDefault();
    if(this.mouseDown) {
      this.mouseDown = false;
      if (event.nativeEvent.ctrlKey) {
        this.setDefaultValues();
        this.updateMidi();
      } else {
        this.position = this.updatePosition(event);
        this.value = this.scalePercentage(this.position);
        this.updateCanvas();
        this.updateMidi();
      }
    }
  },

  onMouseDown(event) {
    event.preventDefault();
    this.mouseDown = true;
  },

  onMouseLeave(event) {
    event.preventDefault();
    this.mouseDown = false;
  },

  onWheel(event) {
    let change =  event.nativeEvent.deltaY / 100 / (this.range);
    this.position -= change;
    event.preventDefault();
    if(this.position < 0) {
      this.position = 0;
    }
    else if(this.position > 1) {
      this.position = 1;
    }
    this.value = this.scalePercentage(this.position);
    this.updateCanvas();
    this.updateMidi();
  },

  render () {
    let {key, name} = this.props.control;
    return (
        <div
          id={key}
          className="jknob-arc"
          data-tip="Something"
          data-for={key}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          onWheel={this.onWheel}
        >
          <canvas
            className="jknob-canvas"
            ref="canvas"
            height="75px"
            width="75px"
          />
          <ReactTooltip
            id={key}
            effect="solid"
            place="bottom"
            getContent={[() => (
              <div>
                <span>{name} - </span>
                <span> {this.value.toString()}</span>
              </div>
            ), 100]}/>
        </div>
    )
}})