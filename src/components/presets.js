import {Component} from 'jumpsuit'
import Select, {Option} from 'rc-select'
import activesynthremote from '../state/activesynthremote'
import {saveUserRemotePreset, deleteUserRemotePreset} from '../state/synthremotes'
import _ from 'lodash'
import {setControlSettingsFromRemoteData} from "../state/activesynthremote";

export default Component({
  onRemovePresetClick(event) {
    event.preventDefault();
    event.stopPropagation();
    let key = event.target.id;
    deleteUserRemotePreset(key);
  },
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
    let {saveRemoteOpen, saveRemoteName, presets} = this.props;
    if(!saveRemoteOpen) {
      activesynthremote.toggleSaveRemote()
    }
    else {
      let overwrite = _.find(presets, (o) => (o.name == saveRemoteName));
      let {controlValues, remote_id, version } = activesynthremote.getState();
      if (saveRemoteName !== '' && saveRemoteName.length > 2) {
        activesynthremote.setSaveRemoteName('');
        activesynthremote.toggleSaveRemote();
        if (overwrite) {
          saveUserRemotePreset(remote_id, version, saveRemoteName, controlValues, overwrite);
        }
        else {
          saveUserRemotePreset(remote_id, version, saveRemoteName, controlValues)
        }
      }
      else {
        activesynthremote.toggleSaveRemote();
      }
    }
  },

  render () {
    //let notEmptyAndLongEnough = this.props.saveRemoteName !== '' && this.props.saveRemoteName.length > 2;
    let error = false;
    let overwrite = false;
    let errorText = '';
    let {saveRemoteName, saveRemoteOpen} = this.props;
    if (!saveRemoteOpen) {
      error = false;
      errorText = '';
      overwrite = false;
    }
    else if(saveRemoteName === '' || saveRemoteName.length < 3) {
      error = true;
      errorText = "Preset name is too short"
    }
    else if (_.findIndex(this.props.presets, function(o) { return o.name === saveRemoteName}) !== -1) {
      error = true;
      errorText = "Preset with that name already exists";
      overwrite = true;
    }
    let readyForSave = (saveRemoteOpen && !error);
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
              <Option
                label={option.name}
                key={option.key}
                value={option.key}
                id={option.key}
              >{option.name}
                <span className="pull-right" >
                  <span
                    onClick={this.onRemovePresetClick}
                    id={option.key}
                    className="glyphicon glyphicon-remove"/>
                </span>
              </Option>
            )
          )}

        </Select>
        <div className="col-lg-3">
          <div className={readyForSave ? "input-group" :"input-group has-error"}>
            <span className="input-group-btn">
              <button
                className={overwrite ? "btn btn-danger" : "btn btn-default"}
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
              placeholder="Preset name..."
            />

          </div>
          <div className="tooltip bottom" role="tooltip" style={error ? {opacity: 1} : {opacity: 0}}>
            <div className="tooltip-arrow"></div>
            <div className="tooltip-inner">
              {errorText}
            </div>
          </div>
        </div>
      </div>
    )
}}, (state) => ({
  presets: state.activesynthremote.presets,
  saveRemoteOpen: state.activesynthremote.saveRemoteOpen,
  saveRemoteName: state.activesynthremote.saveRemoteName,
}))