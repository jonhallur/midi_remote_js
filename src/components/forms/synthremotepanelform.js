import { Component } from 'jumpsuit'
import Input from '../input/input'
import Checkbox from '../input/checkbox'
import Button from '../input/button'
import sysexheaders, {addSysexheaderfield} from '../../state/sysexheaders'
import {eventCheckedHandler, eventValueHandler} from '../../utils/handlers'


export default Component({
    submitForm(event) {
        event.preventDefault();
        addSysexheaderfield(
            this.props.params.key,
            this.props.fieldName,
            this.props.fieldValue,
            this.props.fieldMod
        );
        sysexheaders.setFieldName('');
        sysexheaders.setFieldValue('');
        sysexheaders.setFieldChannelMod(false);
    },
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.submitForm}>
                <Input value={this.props.panelName} type="text" id="synthremotePanelName" placeholder="Name" onChange={eventValueHandler.bind(this, sysexheaders.setFieldName)}/>
                <Button label="Add panel"/>
            </form>
        )
    }
}, (state) => ({
    panelName: state.synthremotes.synthremotePanelName,
}))