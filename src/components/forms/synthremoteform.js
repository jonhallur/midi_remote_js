/**
 * Created by jonhallur on 3.9.2016.
 */
import {Component} from 'jumpsuit'
import Input from '../input/input'
import Button from '../input/button'
import Selector from '../input/selector'
import {getManufacturers} from '../../state/manufacturers'
import synthremotes, {addSynthRemote, publishSynthRemote} from '../../state/synthremotes'
import Loader from '../loader'

export default Component({
    componentDidMount() {
        console.log("SynthRemotesForm mounted");
        getManufacturers();
    },
    submitForm(event) {
        event.preventDefault();
        addSynthRemote(this.props.synthremoteName, this.props.synthremoteManufacturerId)
    },
    updateNameField(event) {
        let name = event.target.value;
        let object = {name: name, manufacturer_id: this.props.synthremoteManufacturerId};
        synthremotes.setSynthRemote(object)
    },

    updateManufacturerId(event) {
        let man_id = event.target.value;
        let object = {name: this.props.synthremoteName, manufacturer_id: man_id};
        synthremotes.setSynthRemote(object)
    },

    onPublishSynthClick(event) {
      event.preventDefault();
      console.log("on publish");
      publishSynthRemote(this.props.params.remote_id)

    },

    render() {
        var id = "manufacturerSelector";
        var label = "Manufacturer";
        var default_text = "Please Select Manufacturer";
        var value = this.props.synthremoteManufacturerId;
        var data = this.props.manufacturers;
        var handler = this.updateManufacturerId;
        let {remote_id} = this.props.params || false;
        const selector = <Selector
                            id={id}
                            label={label}
                            default_text={default_text}
                            value={value}
                            data={data}
                            eventhandler={handler}/>;
        const selector_or_wait = this.props.manufacturersReady ? selector : <Loader/>;
        return (
            <form className="form-horizontal" onSubmit={this.submitForm}>
                <Input
                    type="text"
                    className="form-control"
                    value={this.props.synthremoteName}
                    onChange={this.updateNameField}
                    placeholder="Model Name"/>
                {selector_or_wait}
                <Button label={this.props.synthremoteReady ? 'Update' : 'Create'} />
                <button className={remote_id ? "btn btn-primary" : "hidden"} onClick={this.onPublishSynthClick} >Publish synth</button>
            </form>
            )

    }
}, (state) => ({
    manufacturers: state.manufacturers.manufacturers,
    manufacturersReady: state.manufacturers.manufacturersReady,
    synthremoteManufacturerId: state.synthremotes.synthremote.manufacturer_id,
    synthremoteName: state.synthremotes.synthremote.name,
    synthremoteReady: state.synthremotes.synthremoteReady
}))
