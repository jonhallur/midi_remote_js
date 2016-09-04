/**
 * Created by jonhallur on 16.8.2016.
 */
import { Component } from 'jumpsuit'
import Input from '../input/input'
import CheckBox from '../input/checkbox'
import {addManufacturer, updateManufacturer} from '../../state/manufacturers'
import manufacturersState from '../../state/manufacturers'
import {eventCheckedHandler, eventValueHandler} from '../../utils/handlers'

export default Component({
    submitForm(event) {
        event.preventDefault();
        if (this.props.manufacturerName.value === '') {
            console.log("Empty name not allowed");
            return;
        }
        var id = [this.props.manufacturerId];
        if (this.props.extendedHeader) {
            id = [this.props.manufacturerMsbId, this.props.manufacturerLsbId];

        }
        if(this.props.manufacturerReady) {
            updateManufacturer(this.props.params.key, this.props.manufacturerName, id, this.props.extendedHeader);
            this._reactInternalInstance._context.router.push('/admin/manufacturers');
            return
        }
        addManufacturer(this.props.manufacturerName, id, this.props.extendedHeader);
        manufacturersState.clearManufacturer();

    },

    render() {
        var submitButton = (
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <button
                        type="submit"
                        className="btn btn-default"
                    >{this.props.manufacturerReady ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        );
        var simpleHeader = (
            <div className="form-group">
                <Input
                    type="number"
                    className="form-control"
                    id="manufacturerId"
                    placeholder="SysEx ID"
                    value={this.props.manufacturerId}
                    onChange={eventValueHandler.bind(this, manufacturersState.setIdField)} />
            </div>
        );
        var extendedHeader = (
            <div className="form-group">
                <Input
                    type="number"
                    className="form-control"
                    id="manufacturerIdMSB"
                    placeholder="SysEx ID MSB"
                    value={this.props.manufacturerMsbId}
                    onChange={eventValueHandler.bind(this, manufacturersState.setMsbIdField)} />
                <Input
                    type="number"
                    className="form-control"
                    id="manufacturerIdLSB"
                    placeholder="SysEx ID LSB"
                    value={this.props.manufacturerLsbId}
                    onChange={eventValueHandler.bind(this, manufacturersState.setLsbIdField)} />
            </div>
        );
        return (
            <form className="form-horizontal" onSubmit={this.submitForm} >
                <div className="form-group">
                    <Input
                        className="form-control"
                        type="text"
                        id="manufacturerName"
                        placeholder="Name"
                        value={this.props.manufacturerName}
                        onChange={eventValueHandler.bind(this, manufacturersState.setNameField)}/>
                </div>
                <div className="form-group">
                    <CheckBox
                        className="form-control"
                        id="extendedHeader"
                        label="Extended Header"
                        checked={this.props.extendedHeader}
                        onChange={eventCheckedHandler.bind(this, manufacturersState.setExtendedField)} />
                </div>
                {this.props.extendedHeader ? extendedHeader : simpleHeader }
                {submitButton}
            </form>
        );
    }
}, (state) => ({
    manufacturerName: state.manufacturers.manufacturerName,
    extendedHeader: state.manufacturers.manufacturerExtendedHeader,
    manufacturerId: state.manufacturers.manufacturerId,
    manufacturerMsbId: state.manufacturers.manufacturerMsbId,
    manufacturerLsbId: state.manufacturers.manufacturerLsbId,
    manufacturerReady: state.manufacturers.manufacturerReady,
}));