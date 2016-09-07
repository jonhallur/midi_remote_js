import { Component } from 'jumpsuit'
import { removeSysexheader, clearSysexheader } from '../../state/sysexheaders'
import Loader from '../loader'

export default Component({
    componentDidMount() {
        clearSysexheader();
    },

    render () {
        var sysexheaders = false;
        if (this.props.sysexheadersReady) {
            sysexheaders = this.props.sysexheaders;
        }
        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Name</th>
                    <th># Fields</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {sysexheaders ? Object.keys(sysexheaders).map(function (key) {
                    return <SysexheadersRow sysexheader_id={key} key={key} sysexheader={sysexheaders[key]}/>
                }) : <Loader/> }
                </tbody>
            </table>
        )
    }
})

const SysexheadersRow = Component({
    removeSysexheader(event) {
        event.preventDefault();
        removeSysexheader(this.props.sysexheader_id);
    },

    render() {
        return (
            <tr>
                <td>
                    <a href={"/admin/sysexheader/edit/" + this.props.sysexheader_id} >{this.props.sysexheader.name}</a>
                </td>
                <td>
                    {this.props.sysexheader.fields ? this.props.sysexheader.fields.length : 0}
                </td>
                <td>
                    <a id={this.props.sysexheader_id} href="#" onClick={this.removeSysexheader}><span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>
                </td>
            </tr>
        )
    }

});/**
 * Created by jonhallur on 28.8.2016.
 */
