import { Component } from 'jumpsuit'
import Input from '../input/input'
import Checkbox from '../input/checkbox'
import Button from '../input/button'
import synthremotes, {addPanel} from '../../state/synthremotes'
import {eventCheckedHandler, eventValueHandler} from '../../utils/handlers'


export default Component({
    submitForm(event) {
        event.preventDefault();
        addPanel(this.props.params.key, this.props.panelName)
        console.log("adding", this.props.panelName, "to synthremotes")
    },
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.submitForm}>
                <Input value={this.props.panelName} type="text" id="synthremotePanelName" placeholder="Name" onChange={eventValueHandler.bind(this, synthremotes.setsynthremotePanelName)}/>
                <Button label="Add panel"/>
            </form>
        )
    }
}, (state) => ({
    panelName: state.synthremotes.synthremotePanelName,
}))
