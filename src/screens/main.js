import { Component } from 'jumpsuit'
import {getSynthRemotes} from '../state/synthremotes'
import {NotificationContainer} from 'react-notifications'

export default Component({
  componentDidMount() {
    getSynthRemotes('public/synthremotes');
  },

  render () {
    return (
      <div>
        <NotificationContainer/>
        <h2>Select Synth Remote</h2>
        <div className="list-group">
          {this.props.synthremotes.map(remote => (
            <a key={remote.key} className="list-group-item" href={'/synthremote/' + remote.key}>{remote.name}</a>
          ))}
        </div>
      </div>
    )
  }
}, (state) => ({
  synthremotes: state.synthremotes.synthremotes
}))
