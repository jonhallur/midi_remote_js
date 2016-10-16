/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import {getSynthRemote} from '../state/synthremotes'
import activeSynthRemote, {createActiveSynthRemote} from '../state/activesynthremote'
import jQuery from 'jquery'
import '../pojos/jquery-knob'

export default Component({
  componentDidMount() {
    getSynthRemote(this.props.params.remote_id);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.synthremote.name === '') {
      createActiveSynthRemote(nextProps.synthremote);
    }
  },

  render() {
    return (
      <div>
        <h2>UserSynthRemote {this.props.synthremote.name}</h2>
        {this.props.panels.map((panel, index) => (
          <Panel key={index} id={index} panel={panel} />
        ))}
      </div>
    )
  }
}, (state) => ({
  synthremote: state.synthremotes.synthremote,
  sysexheaders: state.activesynthremote.sysexheaders,
  panels: state.activesynthremote.panels
}))

const Panel = Component({
  render() {
    let panel_key = this.props.id;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.panel.name}</h3>
        </div>
        <div className="panel-body">
          {this.props.panel.controls.map((control, index) => (
            <Control key={index} index={index} control={control} id={panel_key} />
          ))}
        </div>
      </div>
    )
  }
});

const Control = Component({
  componentDidMount() {
    jQuery('.dial').knob({
      'release': function (v) {
        console.log(this.$[0].id);
        activeSynthRemote.setControlValues({uuid: this.$[0].id, value: v})
      }
    });
  },

  handleKnobChange(parameter, event) {
    console.log(parameter, event);
  },

  render() {
    return (
      <input
        type="text"
        className="dial"
        value={this.props.control.default}
        onChange={event => this.handleKnobChange(this.props.control.parameter, this.props.index)}
        id={this.props.control.key}
        title={this.props.control.name}
        data-param-num={this.props.control.parameter}
        data-width="60"
        data-height="60"
        data-fgColor="#66CC66"
        data-angleOffset="-135"
        data-angleArc="270"
        data-thickness="0.55"
        data-skin="tron"
        data-min={this.props.control.min}
        data-max={this.props.control.max}
      />
    )
  }
});