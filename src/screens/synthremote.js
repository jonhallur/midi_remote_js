/**
 * Created by jonhallur on 16.8.2016.
 */
import { Component } from 'jumpsuit'
import SynthRemoteForm from '../components/forms/synthremoteform'
import SynthRemotePanelForm  from '../components/forms/synthremotepanelform'
//import {getSingleSysexheader} from '../state/sysexheaders'
import SynthRemotePanelList from '../components/lists/synthremotepanellist'


export default Component({
    componentDidMount() {
        console.log("get single synthremote")
    },

    render () {
        return (
            <div>
                <h3>Edit Synth Remote</h3>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Edit Synth Remote</h4>
                    </div>
                    <div className="panel-body">
                        <SynthRemoteForm />
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Add Panel</h4>
                    </div>
                    <div className="panel-body">
                        <SynthRemotePanelForm params={this.props.params}/>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Fields List</h4>
                    </div>
                    <div className="panel-body">
                        <SynthRemotePanelList params={this.props.params}/>
                    </div>
                </div>
            </div>
        )
    }
})/**
 * Created by jonhallur on 28.8.2016.
 */
