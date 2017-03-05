import { Component } from 'jumpsuit'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {initializeFirebase, startFirebaseAuthStateMonitor} from '../state/authentication'
import {NotificationContainer} from 'react-notifications'
import NavBar from '../components/navbar'
import {initializeMidi} from '../state/mididevices'

var app = Component({
  componentWillMount() {
    initializeMidi();
  },
  render () {
    initializeFirebase();
    startFirebaseAuthStateMonitor();
    return (
      <div className='container-fluid'>
        <NavBar />
        <NotificationContainer/>
        {this.props.user
          ? this.props.children
          : <div className="alert alert-info" role="alert">Your are not Logged in. Please log in to view content.</div>
        }
      </div>
    )
  }
}, (state) => ({
  user: state.authentication.user,
}));
const WrappedContainer = DragDropContext(HTML5Backend)(app);
export default WrappedContainer
