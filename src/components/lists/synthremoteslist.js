/**
 * Created by jonhallur on 4.9.2016.
 */
import { Component } from 'jumpsuit'
import { removeSynthremote } from '../../state/synthremotes'
import Loader from '../loader'

export default Component({
    componentDidMount() {
        console.log("clear the form");
    },

    render () {
        var synthremotes = this.props.synthremotes ? this.props.synthremotes : {};
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
                {synthremotes ? Object.keys(synthremotes).map(function (key) {
                    return <SynthRemoteRow synthremote_id={key} key={key} synthremote={synthremotes[key]}/>
                }) : <Loader/> }
                </tbody>
            </table>
        )
    }
})

const SynthRemoteRow = Component({
    removeSynthremote(event) {
        event.preventDefault();
        removeSynthremote(this.props.synthremote_id);
    },

    render() {
        return (
            <tr>
                <td>
                    <a href={"/admin/synthremote/edit/" + this.props.synthremote_id} >{this.props.synthremote.name}</a>
                </td>
                <td>
                    {this.props.synthremote.panels ? this.props.synthremote.panels.length : 0}
                </td>
                <td>
                    <a id={this.props.synthremote_id} href="#" onClick={this.removeSynthremote}><span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a>
                </td>
            </tr>
        )
    }

});/**
 * Created by jonhallur on 28.8.2016.
 */
