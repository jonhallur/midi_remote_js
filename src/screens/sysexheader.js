/**
 * Created by jonhallur on 16.8.2016.
 */
import { Component } from 'jumpsuit'
import SysExHeaderForm from '../components/forms/sysexheaderform'
import SysExHeaderFieldsForm  from '../components/forms/sysexheaderfieldsform'
import {getSingleSysexheader} from '../state/sysexheaders'
import SysExHeaderFieldsList from '../components/lists/sysexheaderfieldslist'


export default Component({
    componentDidMount() {
        getSingleSysexheader(this.props.params.key);
    },

    render () {
        return (
            <div>
                <h3>Edit SysExHeader</h3>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Edit Header</h4>
                    </div>
                    <div className="panel-body">
                        <SysExHeaderForm/>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Add field</h4>
                    </div>
                    <div className="panel-body">
                        <SysExHeaderFieldsForm params={this.props.params}/>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Fields List</h4>
                    </div>
                    <div className="panel-body">
                        <SysExHeaderFieldsList params={this.props.params}/>
                    </div>
                </div>
            </div>
        )
    }
})/**
 * Created by jonhallur on 28.8.2016.
 */
