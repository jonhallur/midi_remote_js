import { Component } from 'jumpsuit'
import Input from '../input/input'
import Selector from '../input/selector'
import {getManufacturers} from '../../state/manufacturers'
import sysexheaders, {addSysexheader} from '../../state/sysexheaders'
import {eventValueHandler} from '../../utils/handlers'
import Loader from '../loader'

export default Component({
    componentDidMount() {
        getManufacturers();
    },

    submitForm(event) {
        event.preventDefault();
        var name = this.props.sysexheaderName;
        var manufacturer_id = this.props.sysexheaderManufacturerId;
        addSysexheader(name, manufacturer_id);
    },


    renderManufacturerSelector() {
        if(this.props.manufacturersReady) {
            var id = "manufacturerSelector";
            var label = "Manufacturer";
            var default_text = "Please Select Manufacturer";
            var value = this.props.sysexheaderManufacturerId;
            var data = this.props.manufacturers;
            var handler = eventValueHandler.bind(this, sysexheaders.setManufacturerIdField);
            return (
                <Selector id={id} label={label} default_text={default_text} value={value} data={data} eventhandler={handler}/>
            )
        }
        else {
            return (
                <Loader/>
            );
        }
    },

    render() {
        var submitButton = (
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <button
                        type="submit"
                        className="btn btn-default"
                    >{this.props.sysexheaderReady ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        );
        return (
        <form className="form-horizontal" onSubmit={this.submitForm}>
            <Input className="form-control" type="text" id="sysexheaderName" placeholder="Name" value={this.props.sysexheaderName} onChange={eventValueHandler.bind(this, sysexheaders.setNameField)}/>
            {this.renderManufacturerSelector()}
            {submitButton}
        </form>
        )
    }
}, (state) => ({
    manufacturersReady: state.manufacturers.manufacturersReady,
    manufacturers: state.manufacturers.manufacturers,
    sysexheaderName: state.sysexheaders.sysexheader.name,
    sysexheaderManufacturerId: state.sysexheaders.sysexheader.manufacturer_id,
    sysexheaderReady: state.sysexheaders.sysexheaderReady
}))