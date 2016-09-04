
import { Component } from 'jumpsuit'

export default Component({
  render() {
      return (
          <div className="form-group">
              <label htmlFor={this.props.id} className="col-sm-2 control-label">{this.props.placeholder}</label>
              <div className="col-sm-10">
                  <input
                      className='form-control'
                      type={this.props.type}
                      id={this.props.id}
                      placeholder={this.props.placeholder}
                      value={this.props.value}
                      onChange={this.props.onChange}
                  />
              </div>
          </div>
      )
  }
})
