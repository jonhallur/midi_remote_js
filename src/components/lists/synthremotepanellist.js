import { Component } from 'jumpsuit'
import {swapSysexheaderfields, deleteSysexheaderfield} from '../../state/sysexheaders'
import Loader from '../loader'

export default Component({

    render () {
        var panels = {0: {name: "name", value: 100, channel_mod: true}, 1: {name: "foo", value: 200, channel_mod: false}, 2: {name: "another", value: 250, channel_mod: true}};
        //var fields = this.props.fields;
        var params = this.props.params;
        return (

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Remote</th>
                    <th>MOVE</th>
                </tr>
                </thead>
                <tbody>
                {panels ? Object.keys(panels).map(function (key) {
                    return <SysExHeaderFieldRow params={params} field_id={key} key={key} panel={panels[key]}/>
                }) : <tr><td><Loader/></td><td><Loader/></td><td><Loader/></td></tr> }
                </tbody>
            </table>

        )
    }
}, (state) => ({
    fields: state.sysexheaders.sysexheaderFields
}))

var target_id;
var source_id;

const SysExHeaderFieldRow = Component({
    deleteField(event) {
        event.preventDefault();
        var id = event.target.id;
        //deleteSysexheaderfield(this.props.params.key, id);
    },
    dragHandler(object) {
        source_id = object.target.id;

    },
    dragEnter(object) {
        target_id = object.target.id;

    },
    dragEnd() {
        if(source_id === target_id) {
            return;
        }
        //swapSysexheaderfields(this.props.params.key, source_id, target_id);
    },

    render() {
        return (
            <tr >
                <td>
                    {this.props.panel.name}
                </td>
                <td>
                    <a id={this.props.field_id} href="#" onClick={this.deleteField}><span id={this.props.field_id} className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>
                </td>
                <td id={this.props.field_id} draggable="true"  onDragEnd={this.dragEnd} onDrag={this.dragHandler} onDragEnter={this.dragEnter}>
                    <span id={this.props.field_id} className="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span>
                </td>
            </tr>
        )
    }

});/**
 * Created by jonhallur on 07/09/16.
 */
