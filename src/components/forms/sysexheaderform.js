import { Component } from 'jumpsuit'
import Input from '../input/input'
import Selector from '../input/selector'
import {getManufacturers} from '../../state/manufacturers'
import sysexheaders, {addSysexheader} from '../../state/sysexheaders'
import {eventValueHandler} from '../../utils/handlers'
import Loader from '../loader'

function getDataFromId(manufacturers, manufacturer_id) {
  let fields = [];
  Object.keys(manufacturers).map((key) => {
    if (key === manufacturer_id) {
      console.log(manufacturers[key]);
      fields = manufacturers[key].manufacturer_sys_ex_id;

    }
  });
  return fields;
}
export default Component({
    componentDidMount() {
        getManufacturers();
    },

    submitForm(event) {
      event.preventDefault();
      var name = this.props.sysexheaderName;
      var manufacturer_id = this.props.sysexheaderManufacturerId;
      let manufacturer_data = getDataFromId(this.props.manufacturers, manufacturer_id);
      addSysexheader(name, manufacturer_id, manufacturer_data);
    },


    renderManufacturerSelector() {
        if(this.props.manufacturersReady) {
            var id = "manufacturerSelector";
            var label = "Manufacturer";
            var default_text = "Please Select Manufacturer";
            var value = this.props.sysexheaderManufacturerId;
            var data = this.props.manufacturers;
            var handler = (event) => sysexheaders.setManufacturerIdField(event.target.value);
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
            <Input
              className="form-control"
              type="text"
              id="sysexheaderName"
              placeholder="Name"
              value={this.props.sysexheaderName}
              onChange={(event) => sysexheaders.setNameField(event.target.value)}/>
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