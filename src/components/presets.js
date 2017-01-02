import {Component} from 'jumpsuit'
import Select, {Option} from 'rc-select'
import activesynthremote from '../state/activesynthremote'
import {saveUserRemotePreset} from '../state/synthremotes'
import _ from 'lodash'
import {setControlSettingsFromRemoteData} from "../state/activesynthremote";

export default Component({
  onPresetChange(key) {
    let preset = _.find(this.props.presets, function(o) { return o.key === key});
    let setPartial=false;
    setControlSettingsFromRemoteData(preset.controlValues, setPartial);
  },

  onInputKeydown(event) {
    if (event.key === 'Enter') {
      if(this.props.saveRemoteName.length > 2) {
        this.savePresetAndClose();
      }
    }
  },

  onSaveButtonClick(event) {
    event.preventDefault();
    this.savePresetAndClose();
  },

  savePresetAndClose() {
    if(!this.props.saveRemoteOpen) {
      activesynthremote.toggleSaveRemote()
    }
    else {
      let name = this.props.saveRemoteName;
      let {controlValues, remote_id, version } = activesynthremote.getState();
      if (name !== '' && name.length > 2) {
        activesynthremote.setSaveRemoteName('');
        activesynthremote.toggleSaveRemote();
        saveUserRemotePreset(remote_id, version, name, controlValues);
      }
      else {
        activesynthremote.toggleSaveRemote();
      }
    }
  },

  render () {
    let notEmptyAndLongEnough = this.props.saveRemoteName !== '' && this.props.saveRemoteName.length > 2;
    let readyForSave = (this.props.saveRemoteOpen && notEmptyAndLongEnough);
    let saveIcon = readyForSave ? 'glyphicon glyphicon-floppy-saved' : 'glyphicon glyphicon-floppy-disk';
    return (
      <div>
        <Select
          style={{ width: 200, float: 'left' }}
          placeholder="Select preset"
          onChange={this.onPresetChange}
          optionLabelProp="label"
        >
          {this.props.presets.map(
            (option) => (
              <Option label={option.name} key={option.key} value={option.key} id={option.key}>{option.name}</Option>
            )
          )}

        </Select>
        <div className="col-lg-3">
          <div className={readyForSave ? "input-group" :"input-group has-error"}>
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                onClick={this.onSaveButtonClick}
                type="button">
                <span
                  className={saveIcon}
                  aria-hidden="true"/>
              </button>
            </span>
            <input
              type="text"
              onChange={(e) => {activesynthremote.setSaveRemoteName(e.target.value)}}
              onKeyPress={this.onInputKeydown}
              className={this.props.saveRemoteOpen ? "form-control" : "hidden"}
              value={this.props.saveRemoteName}
              placeholder="Preset name..." />
          </div>
        </div>
      </div>
    )
}}, (state) => ({
  presets: state.activesynthremote.presets,
  saveRemoteOpen: state.activesynthremote.saveRemoteOpen,
  saveRemoteName: state.activesynthremote.saveRemoteName,
}))