/**
 * Created by jonh on 9.10.2016.
 */
import {Component} from 'jumpsuit'
import {getSynthRemote} from '../state/synthremotes'
import {createActiveSynthRemote} from '../state/activesynthremote'

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
      </div>
    )
  }
}, (state) => ({
  synthremote: state.synthremotes.synthremote,
  sysexheaders: state.activesynthremote.sysexheaders,


}))