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
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Edit Basic Info</h4>
          </div>
          <div className="panel-body">
            <SynthPanelForm params={this.props.params}/>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Create Control</h4>
          </div>
          <div className="panel-body">
            <SynthRemoteControlForm params={this.props.params}/>
          </div>
        </div>
      </div>
    )
  }
})