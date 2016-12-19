/**
 * Created by jonhallur on 3.9.2016.
 */
import {Component} from 'jumpsuit'
import SynthRemoteForm from '../components/forms/synthremoteform'
import SynthRemotesList from '../components/lists/synthremoteslist'
import {getSynthRemotes} from '../state/synthremotes'

export default Component({
    componentDidMount() {
        console.log("Component SynthRemotes MOUNTED");
        getSynthRemotes('public/synthremotes');
    },

    render() {
        return (
            <div>
                <h3>Synth Remote</h3>
                <SynthRemoteForm />
                <SynthRemotesList synthremotes={this.props.synthremotes} />
            </div>
        )
    }
}, (state) => ({
    synthremotes: state.synthremotes.synthremotes
}))