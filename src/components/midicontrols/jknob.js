import {Component} from 'jumpsuit'
import ReactTooltip from 'react-tooltip'

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
    this.value = this.props.control.default;
    this.range = this.props.control.maximum - this.props.control.minimum;
    this.position = this.value / this.range;
    this.updateCanvas(true);
    this.lastValue = this.value;
  },
  componentDidUpdate() {
    this.updateCanvas()
  },

  updateCanvas(initial=false) {
    if (this.value === this.lastValue) {
      return;
    }
    if(this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function" && !initial) {
      this.props.onValueChange(this.value);
    }
    this.lastValue = this.value;
    let canvas = this.refs.canvas.getContext('2d');

    // calculate values we'll need later
    let lineWidth = (HALF_WIDTH/2) - 1;
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
    canvas.arc(centerxy, centerxy, radius, startAngle, readingAngle, false);
    canvas.stroke();

    //
    canvas.font = "12px sans-serif";
    let fillText = this.value.toString();
    canvas.fillText(fillText, 36 - fillText.length*3.1, 42);
  },

  updatePosition(event) {
    let {layerX, layerY} = event.nativeEvent;
    event.preventDefault();
    let localX = layerX - HALF_WIDTH;
    let localY = layerY - HALF_WIDTH;
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

  onMouseMove(event) {
    if(this.mouseDown) {
      this.position = this.updatePosition(event);
      this.value = this.scalePercentage(this.position);
      this.updateCanvas()

    }
  },

  onMouseUp(event) {
    event.preventDefault();
    this.position = this.updatePosition(event);
    this.value = this.scalePercentage(this.position);
    this.mouseDown = false;
    this.updateCanvas()

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
    this.position -= event.nativeEvent.deltaY / 100 / (this.range);
    event.preventDefault();
    if(this.position < 0) {
      this.position = 0;
    }
    else if(this.position > 1) {
      this.position = 1;
    }
    this.value = this.scalePercentage(this.position);
    this.updateCanvas()
  },

  render () {
    let {key, name, short} = this.props.control;
    let label = short ? short.substring(0,8) : '';
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
}}, (state) => ({

}))