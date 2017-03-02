import { Component } from 'jumpsuit'
import Input from '../input/input'
import Button from '../input/button'
import synthremotes from '../../state/synthremotes'
import synthpanels from '../../state/synthpanels'
import {addPanel, updatePanelName} from '../../state/synthpanels'


export default Component({
    submitForm(event) {
        event.preventDefault();
      if (this.props.synthpanelReady) {
        let {remote_id, panel_id} = this.props.params;
        let pathList = ['admin/synthremotes', remote_id, 'panels', panel_id];
        updatePanelName(pathList, this.props.panelName);
      }
      else {
        addPanel(this.props.params.remote_id, this.props.panelName);
        synthremotes.setSynthremotePanelName('');
        synthpanels.setPanelName('');
      }
    },
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.submitForm}>
                <Input
                  value={this.props.panelName}
                  type="text"
                  id="synthremotePanelName"
                  placeholder="Name"
                  onChange={event => synthpanels.setPanelName(event.target.value)}/>
                <Button label={this.props.synthpanelReady ? 'Update' : 'Create'}/>
            </form>
        )
    }
}, (state) => ({
    panelName: state.synthpanels.synthpanel.name,
    synthpanelReady: state.synthpanels.synthpanelReady

}))
