/**
 * Created by jonh on 9.10.2016.
 */
import {State} from 'jumpsuit'

const activesynthremote = State('activesynthremote',{
  initial: {
    remote_id: ''
  },

  setRemoteId: (state, payload) => ({
    remote_id: payload
  }),


});

export default activesynthremote;

export function createActiveSynthRemote(synthremote) {
  console.log(synthremote.name);
  console.log(synthremote);
  activesynthremote.setRemoteId(synthremote.name)
}