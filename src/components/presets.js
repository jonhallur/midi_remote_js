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
    let setPartial = false;
    setControlSettingsFromRemoteData(preset.controlValues, setPartial);
    activesynthremote.setUsingKeyValue({key: 'presetChanged', value: false});
    activesynthremote.setUsingKeyValue({key: 'saveModalOpen', value: false});
    activesynthremote.setSaveRemoteName(preset.name);
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
    let {saveRemoteName, presets} = this.props;
    let overwrite = _.find(presets, (o) => (o.name == saveRemoteName));
    let {controlValues, remote_id, version } = activesynthremote.getState();
    if (saveRemoteName !== '' && saveRemoteName.length > 2) {
      activesynthremote.setSaveRemoteName('');
      activesynthremote.setUsingKeyValue({key: 'saveModalOpen', value: false});
      activesynthremote.setUsingKeyValue({key: 'presetChanged', value: false});
      if (overwrite) {
        saveUserRemotePreset(remote_id, version, saveRemoteName, controlValues, overwrite);
      }
      else {
        saveUserRemotePreset(remote_id, version, saveRemoteName, controlValues)
      }
    }
  },
  render () {
    //let notEmptyAndLongEnough = this.props.saveRemoteName !== '' && this.props.saveRemoteName.length > 2;
    let error = false;
    let overwrite = false;
    let errorText = '';
    let {saveRemoteName} = this.props;
    if(saveRemoteName === '' || saveRemoteName.length < 3) {
      error = true;
      errorText = "Preset name is too short"
    }
    else if (_.findIndex(this.props.presets, function(o) { return o.name === saveRemoteName}) !== -1) {
      error = true;
      errorText = "Preset already exists";
      overwrite = true;
    }
    let saveIcon = error ? 'glyphicon glyphicon-floppy-remove' : 'glyphicon glyphicon-floppy-disk';
    return (
      <div className="form-inline">
        <h2>Presets</h2>
        <Select
          style={{ width: 200, float: 'left', height: 36 }}
          placeholder="Select preset"
          onChange={this.onPresetChange}
          optionLabelProp="label"
          optionFilterProp="label"
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
        <div className="form-inline">
          <div className={!error ? "input-group" :"input-group has-error"}>
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
              className="form-control"
              value={this.props.saveRemoteName}
              placeholder="Preset name..."
            />
          </div>
        </div>
        <div className="tooltip bottom" role="tooltip" style={error ? {opacity: 1} : {opacity: 0}}>
          <div className="tooltip-arrow"></div>
          <div className="tooltip-inner">
            {errorText}
          </div>
        </div>
        <p>&nbsp;</p>
      </div>
    )
}}, (state) => ({
  presets: state.activesynthremote.presets,
  presetName: state.activesynthremote.presetName,
  saveRemoteName: state.activesynthremote.saveRemoteName,
}))