/**
 * Created by jonh on 29.12.2016.
 */
import {Component} from 'jumpsuit'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default Component({
  componentWillReceiveProps: function (nextProps) {

  },
  render () {
    let ready = !this.props.ready ? 'Synth remote is not ready' : '';
    let creating = this.props.creating ? 'Synth remote creating' : '';
    let loading = this.props.loading ? 'Loading synth remote' : '';
    let sending = this.props.sending ? 'Sending bulk MIDI patch Data' : '';
    return (
      <Modal
        isOpen={!this.props.ready}
        style={customStyles}
        contentLabel="Example Modal">
        <h2 ref="subtitle">Please wait</h2>
        <h4>{creating}</h4>
        <h4>{loading}</h4>
        <h4>{sending}</h4>
      </Modal>
    )
}})