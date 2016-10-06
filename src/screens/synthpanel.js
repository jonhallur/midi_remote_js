/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import SynthPanelForm from '../components/forms/synthremotepanelform'
import SynthRemoteControlForm from '../components/forms/synthremotecontrolform'
import SynthRemoteControlList from '../components/lists/synthremotecontrollist'

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
            <h5>Edit Basic Info</h5>
          </div>
          <div className="panel-body">
            <SynthPanelForm params={this.props.params}/>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h5>Create Control</h5>
          </div>
          <div className="panel-body">
            <SynthRemoteControlForm params={this.props.params}/>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h5>Panel Controls</h5>
          </div>
          <div className="panel-body">
            <SynthRemoteControlList params={this.props.params}/>
          </div>
        </div>
      </div>
    )
  }
})