/**
 * Created by jonhallur on 16.8.2016.
 */
import { Component } from 'jumpsuit'
import ManufacturersForm from '../components/forms/manufacturerform'
import ManufacturersList from '../components/lists/manufacturerslist'
import manufacturersState, {getManufacturers} from '../state/manufacturers'


export default Component({
    componentDidMount() {
        getManufacturers();
        manufacturersState.clearManufacturer();
    },

    render () {
        return (
            <div>
                <h3>Create Manufacturer</h3>
                <ManufacturersForm/>
                <ManufacturersList manufacturers={this.props.manufacturers} manufacturersReady={this.props.manufacturersReady} />
            </div>
        )
    }
}, (state) => ({
    manufacturersReady: state.manufacturers.manufacturersReady,
    manufacturers: state.manufacturers.manufacturers
}))