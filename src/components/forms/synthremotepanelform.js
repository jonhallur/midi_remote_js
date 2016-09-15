import { Component } from 'jumpsuit'
import Input from '../input/input'
import Button from '../input/button'
import synthremotes, {addPanel} from '../../state/synthremotes'
import { eventValueHandler} from '../../utils/handlers'


export default Component({
    submitForm(event) {
        event.preventDefault();
        addPanel(this.props.params.key, this.props.panelName);
        synthremotes.setsynthremotePanelName('')
    },
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.submitForm}>
                <Input value={this.props.panelName} type="text" id="synthremotePanelName" placeholder="Name" onChange={eventValueHandler.bind(this, synthremotes.setsynthremotePanelName)}/>
                <Button label={this.props.synthpanelReady ? 'Update' : 'Create'}/>
            </form>
        )
    }
}, (state) => ({
    panelName: state.synthremotes.synthremotePanelName,
    synthpanelReady: state.synthpanels.synthpanelReady

}))
