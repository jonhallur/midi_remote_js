
import { State } from 'jumpsuit';



const firebaseState = State('database', {
  initial: {
    ready: false,
    data: [],
    extendedHeader: false,
  },

  setExtended: (state, extended) => ({
      extendedHeader: extended
  })
});

export default firebaseState

