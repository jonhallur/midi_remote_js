/**
 * Created by jonh on 15.9.2016.
 */
import {Component} from 'jumpsuit'
import SynthPanelForm from '../components/forms/synthremotepanelform'
import SynthRemoteControlForm from '../components/forms/synthremotecontrolform'
import SynthRemoteControlList from '../components/lists/synthremotecontrollist'
import {getSynthPanel} from '../state/synthpanels'
import {getSynthRemote} from '../state/synthremotes'
import midicontrols from '../state/midicontrols'

export default Component({
  componentDidMount() {
    let {remote_id, panel_id} = this.props.params;
    let pathList = ['admin/synthremotes', remote_id, 'panels', panel_id];
    getSynthPanel(pathList);
    getSynthRemote(remote_id);
  },

  render() {
    let {remote_id} = this.props.params;
    let remote_url = '/admin/synthremote/edit/' +  remote_id;
    return (
      <div>
        <h3>Edit {this.props.panelName} Panel of <a href={remote_url}>{this.props.synthremote.name}</a></h3>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Edit Basic Info
              <span
                id={this.props.control_id}
                className="glyphicon glyphicon-align-justify float-right"
                aria-hidden="true"
                onClick={midicontrols.toggleBasicPanel}
              >&nbsp;
              </span>
            </h4>
          </div>
          <div className={this.props.showBasicPanel ? "panel-body": "hidden" }>
            <SynthPanelForm params={this.props.params}/>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Create Control
              <span
                id={this.props.control_id}
                className="glyphicon glyphicon-align-justify float-right"
                aria-hidden="true"
                onClick={midicontrols.toggleCreatePanel}

              >&nbsp;
              </span>
            </h4>
          </div>
          <div className={this.props.showCreatePanel ? "panel-body": "hidden" }>
            <SynthRemoteControlForm params={this.props.params}/>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Panel Controls
              <span
                id={this.props.control_id}
                className="glyphicon glyphicon-align-justify float-right"
                aria-hidden="true"
                onClick={midicontrols.toggleControlsPanel}
              >&nbsp;
              </span>
            </h4>
          </div>
          <div className={this.props.showControlsPanel ? "panel-body": "hidden" }>
            <SynthRemoteControlList params={this.props.params}/>
          </div>
        </div>
      </div>
    )
  }
}, (state) => ({
  showBasicPanel: state.midicontrols.showBasicPanel,
  showCreatePanel: state.midicontrols.showCreatePanel,
  showControlsPanel: state.midicontrols.showControlsPanel,
  panelName: state.synthpanels.synthpanel.name,
  synthremote: state.synthremotes.synthremote
}))