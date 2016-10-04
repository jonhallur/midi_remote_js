/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'
import Selector from '../input/arrayselector'

export default Component({
  render() {
    return (
      <form className="form-horizontal">
        <Selector
          id="typeSelector"
          value={this.props.selectedType}
          />
      </form>
    )
  }
}, (state) => ({
  controlName: state.synthpanels.synthpanel,
  controlTypes: state.controltypes.types,
  selectedType: state.synthpanels.selectedType
}));

