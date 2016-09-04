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
                <Input value={this.props.fieldName} type="text" id="sysexheaderFieldName" placeholder="Name" onChange={eventValueHandler.bind(this, sysexheaders.setFieldName)}/>
                <Input value={this.props.fieldValue} type="number" id="sysexheaderFieldValue" placeholder="Value" onChange={eventValueHandler.bind(this, sysexheaders.setFieldValue)} />
                <Checkbox checked={this.props.fieldMod} id="sysexheaderFieldChannelMod" label="Channel Modified Field" onChange={eventCheckedHandler.bind(this, sysexheaders.setFieldChannelMod)} />
                <Button label="Add field"/>
            </form>
        )
    }
}, (state) => ({
    fieldName: state.sysexheaders.sysexheaderFieldName,
    fieldValue: state.sysexheaders.sysexheaderFieldValue,
    fieldMod: state.sysexheaders.sysexheaderFieldChannelMod
}))