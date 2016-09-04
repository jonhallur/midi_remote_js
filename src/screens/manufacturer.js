/**
 * Created by jonhallur on 16.8.2016.
 */
import { Component } from 'jumpsuit'
import ManufacturerForm from '../components/forms/manufacturerform'
import {getSingleManufacturer} from '../state/manufacturers'


export default Component({
    componentDidMount() {
        getSingleManufacturer(this.props.params.key);
    },

    render () {

        return (
            <div>
                <h3>Edit Manufacturer</h3>
                <ManufacturerForm params={this.props.params}/>
            </div>
        )
    }
})