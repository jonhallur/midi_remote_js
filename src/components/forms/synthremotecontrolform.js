/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'

export default Component({
  render() {
    return (
      <form className="form-horizontal">
        <Input />
      </form>
    )
  }
}, (state) => ({
  controlName: state.synthpanels.synthpanel
}))