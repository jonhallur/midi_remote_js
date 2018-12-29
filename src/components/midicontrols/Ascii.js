import {Component} from 'jumpsuit'
import R from 'ramda'

function createAscii(inputString, length) {
  let filledArray = Array.apply(null, Array(length)).map(Number.prototype.valueOf, 32);
  for(let i=0; i < length; i++) {
    let charCode = inputString.charCodeAt(i);
    if(!isNaN(charCode))
      filledArray[i] = charCode;
  }
  return filledArray;
}

export default Component({
  getInitialState () {
    return {value: "init"}
  },

  componentDidMount() {
    let {control, controlValues} = this.props;
    this.first = parseInt(control.first, 10);
    let length = parseInt(control.last, 10) - this.first;
    this.length = length+1;
    this.re = new RegExp("^[\x20-\x7E]{1," + length + "}$");
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== undefined) {
      let value = nextProps.value.map((charCode) => {
        return String.fromCharCode(charCode)
      }).join("").trim();
      this.inputValid = this.re.test(value);
      this.setState({
        value: value
      })
    }
  },

  sendOnValueChange(newValue) {
    if(this.props.onValueChange !== undefined && typeof this.props.onValueChange === "function") {
      this.props.onValueChange(newValue);
    }
  },

  setNewValue(inputValue) {
    this.sendOnValueChange(createAscii(inputValue, this.length));
  },

  handleTextInput(event) {
    event.preventDefault();
    let inputValue = event.target.value;
    this.inputValid = this.re.test(inputValue);
    this.setState({value: inputValue});
  },

  handleButtonPress(event) {
    event.preventDefault();
    if(this.inputValid) {
      this.setNewValue(this.state.value);
    }
  },

  render() {
    let {control, controlValues} = this.props;
    let isValid = this.validInput ? 'form-control is-valid' : 'form-control is-invalid';
    return (
      <div className="asciiBox">
        <input
          className={isValid}
          type="text"
          placeholder="Type patch name here"
          value={this.state.value}
          id={control.key}
          onChange={(event) => { this.handleTextInput(event) }}
        />
        <button disabled={!this.inputValid}  className="btn btn-default" onClick={(event) => { this.handleButtonPress(event) }}>Apply</button>
      </div>
    )
  }
}, (state) => ({
  controlValues: state.activesynthremote.controlValues
}));