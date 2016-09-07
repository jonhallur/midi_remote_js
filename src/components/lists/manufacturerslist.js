import { Component } from 'jumpsuit'
import {removeManufacturer, clearManufacturer} from '../../state/manufacturers'
import Loader from '../loader'

export default Component({
    componentDidMount() {
        clearManufacturer();
    },

    render () {
        var manufacturers = false;
        if (this.props.manufacturersReady) {
            manufacturers = this.props.manufacturers;
        }
        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {manufacturers ? Object.keys(manufacturers).map(function (key) {
                    return <ManufacturerRow manufacturer_id={key} key={key} manufacturer={manufacturers[key]}/>
                }) : <Loader/> }
                </tbody>
            </table>
        )
    }
})

const ManufacturerRow = Component({
    deleteManufacturer(event) {
        event.preventDefault();
        removeManufacturer(this.props.manufacturer_id);
    },

    render() {
        return (
            <tr>
                <td>
                    <a href={"/admin/manufacturer/edit/" + this.props.manufacturer_id} >{this.props.manufacturer.name}</a>
                </td>
                <td>
                    {this.props.manufacturer.manufacturer_sys_ex_id.toString()}
                </td>
                <td>
                    <a id={this.props.manufacturer_id} href="#" onClick={this.deleteManufacturer}><span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>
                </td>
            </tr>
        )
    }

});