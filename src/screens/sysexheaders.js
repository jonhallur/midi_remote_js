/**
 * Created by jonhallur on 25.8.2016.
 */
import { Component } from 'jumpsuit'
import SysExHeaderForm from '../components/forms/sysexheaderform'
import SysExHeaderList from '../components/lists/sysexheaderslist'
import {getSysexheaders} from "../state/sysexheaders";


export default Component({
    componentDidMount() {
        getSysexheaders();
    },

    render () {
        return (
            <div>
                <h3>Create SysExHeader</h3>
                <SysExHeaderForm />
                <SysExHeaderList sysexheaders={this.props.sysexheaders} sysexheadersReady={this.props.sysexheadersReady} />
            </div>
        )
    }
}, (state) => ({
    sysexheaders: state.sysexheaders.sysexheaders,
    sysexheadersReady: state.sysexheaders.sysexheadersReady
}))