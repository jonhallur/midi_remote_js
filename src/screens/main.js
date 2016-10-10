import { Component } from 'jumpsuit'
import {getSynthRemotes} from '../state/synthremotes'

export default Component({
  componentDidMount() {
    getSynthRemotes();
  },

  render () {
    return (
      <div>
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
