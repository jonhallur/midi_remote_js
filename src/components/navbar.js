/**
 * Created by jonh on 5.3.2017.
 */
import Login from './login'
import { Component } from 'jumpsuit'
import Modal from 'react-modal'
import MidiDevices from './mididevices'
import Presets from './presets'
import {customStyles} from '../pojos/constants'
import mididevices from '../state/mididevices'
import activesynthremote from '../state/activesynthremote'
import _ from 'lodash'

export default Component({
  componentDidMount() {

  },
  onPanelChange(change) {
    let {panelWidth, panelWidths} = this.props;
    let pos = _.indexOf(panelWidths, Number(panelWidth)) + change;
    if (pos > -1 && pos < panelWidths.length) {
      activesynthremote.setUsingKeyValue({key: 'panelWidth', value: panelWidths[pos]});
    }
  },
  render() {
    let midiIcon = this.props.selectedOutput ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-alert';
    let presetIcon = this.props.presetChanged ? 'glyphicon glyphicon-alert' : 'glyphicon glyphicon-ok';
    let Header = this.props.name ? this.props.name : 'MIDICONTROL';
    window.document.title = Header;
    let PresetName = this.props.saveRemoteName || "PRESETS";
    return (
      <nav className="navbar navbar-default" role="search">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            {Header}
          </a>
        </div>
        {this.props.synthRemoteReady ?
        <ul className="nav navbar-nav">
          <li className="dropdown">
            <a
              className='dropdown-toggle'
              onClick={mididevices.openMidiModal}
            >
              <span aria-hidden="true" className={midiIcon} />
                &nbsp; MIDI
            </a>
            <MidiModal isOpen={this.props.midiModalOpen}/>
          </li>
          <li>
            <a
              className='dropdown-toggle'
              onClick={(e) => activesynthremote.setUsingKeyValue({key: 'saveModalOpen', value: true})}
            >
              <span aria-hidden="true" className={presetIcon} />
              &nbsp; {PresetName}
            </a>
            <PresetModal isOpen={this.props.saveModalOpen}/>
          </li>
          <li>

          </li>
        </ul>

          : null }
        <form className="navbar-form navbar-right">
          <div className="form-group">
            <div className="input-group">
              <span className="input-group-btn">
                  <button
                    type="button"
                    className="btn btn-default btn-number"
                    onClick={(event) => this.onPanelChange(-1)}
                  >
                    <span className="glyphicon glyphicon-minus" />
                  </button>
              </span>
              <span className="input-group-btn">
                <button
                  type="button"
                  className="btn btn-default btn-number"
                  data-type="plus"
                  data-field="quant[2]"
                  onClick={(event) => this.onPanelChange(1)}
                >
                  <span className="glyphicon glyphicon-plus" />
                </button>
              </span>
            </div>
          </div>
        </form>
        <Login/>
      </nav>
    )
  }
}, (state) => ({
  selectedOutput: state.mididevices.selectedOutput,
  midiModalOpen: state.mididevices.midiModalOpen,
  saveModalOpen: state.activesynthremote.saveModalOpen,
  synthRemoteReady: state.activesynthremote.synthRemoteReady,
  presetChanged: state.activesynthremote.presetChanged,
  panelWidths: state.activesynthremote.panelWidths,
  panelWidth: state.activesynthremote.panelWidth,
  name: state.activesynthremote.name,
  saveRemoteName: state.activesynthremote.saveRemoteName,
}))

function onMidiModalCloseRequest(event) {
  if(event) {
    event.preventDefault();
  }
  mididevices.closeMidiModal();
}

function onSavePresetModalCloseRequest(event) {
  if(event) {
    event.preventDefault();
  }
  activesynthremote.setUsingKeyValue({key: 'saveModalOpen', value: false})
}

const MidiModal = (props) => (
  <Modal
    isOpen={props.isOpen}
    style={customStyles}
    contentLabel="Midi Modal"
    onRequestClose={onMidiModalCloseRequest}
  >
    <a
      href="#"
      onClick={onMidiModalCloseRequest}
    >
      <span
        className="glyphicon glyphicon-remove pull-right"
      />
    </a>
    <MidiDevices/>
  </Modal>
);

const PresetModal = (props) => (
  <Modal
    isOpen={props.isOpen}
    style={customStyles}
    contentLabel="Preset Modal"
    onRequestClose={onSavePresetModalCloseRequest}
  >
    <a
      href="#"
      onClick={onSavePresetModalCloseRequest}
    >
      <span
        className="glyphicon glyphicon-remove pull-right"
      />
    </a>
    <Presets/>
  </Modal>
);