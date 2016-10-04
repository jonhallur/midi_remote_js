/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import SynthPanelForm from '../components/forms/synthremotepanelform'
import SynthRemoteControlForm from '../components/forms/synthremotecontrolform'

export default Component({
  componentDidMount() {
    console.log("get single panel");
    console.log(this.props.params);
  },

  render() {
    return (
      <div>
        <h3>Edit Synth Panel</h3>
        <SynthPanelForm params={this.props.params}/>
        <SynthRemoteControlForm />
      </div>
    )
  }
})