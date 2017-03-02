
import { Component } from 'jumpsuit'

export default Component({
  render() {
    return (
      <div className={this.props.value ? "form-group row" : "form-group row has-error"}>
        <LabelAndControl {...this.props} />
      </div>
      )
  }
});

export const EmailInput = Component({
  render() {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isEmailValid = this.props.value.match(emailRegex);
    return (
      <div className={isEmailValid ? "form-group row" : "form-group row has-error"}>
        <LabelAndControl {...this.props} />
      </div>
    )
  }
});

const LabelAndControl = (props) => (
  <div>
    <label htmlFor={props.id} className="col-sm-2 control-label">{props.placeholder}</label>
    <div className="col-sm-10">
      <input
        className='form-control'
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  </div>
);