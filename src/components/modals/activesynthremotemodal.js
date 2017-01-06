/**
 * Created by jonh on 29.12.2016.
 */
import {Component} from 'jumpsuit'
import Modal from 'react-modal'
import {customStyles} from '../../pojos/constants'

export default Component({
  render () {
    let {
      synthRemoteReady,
      synthRemoteCreating,
      synthRemoteLoading,
      synthRemoteSending,
      controlsToSend,
      controlsSent
    } = this.props;
    let ready = !synthRemoteReady ? 'Synth remote is not ready' : '';
    let creating = synthRemoteCreating ? 'Synth remote creating' : '';
    let loading = synthRemoteLoading ? 'Loading synth remote' : '';
    let sending = synthRemoteSending ? `Sending bulk MIDI patch Data ${controlsSent} of ${controlsToSend}` : '';
    return (
      <Modal
        isOpen={!synthRemoteReady}
        style={customStyles}
        contentLabel="Example Modal">
        <h2 ref="subtitle">Please wait</h2>
        <h4>{creating}</h4>
        <h4>{loading}</h4>
        <h4>{sending}</h4>
      </Modal>
    )
}}, (state) => ({
  synthRemoteReady: state.activesynthremote.synthRemoteReady,
  synthRemoteCreating: state.activesynthremote.synthRemoteCreating,
  synthRemoteLoading: state.activesynthremote.synthRemoteLoading,
  synthRemoteSending: state.activesynthremote.synthRemoteSending,
  controlsToSend: state.activesynthremote.controlsToSend,
  controlsSent: state.activesynthremote.controlsSent
}))