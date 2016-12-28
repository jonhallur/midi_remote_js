import { Component } from 'jumpsuit'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {initializeFirebase, startFirebaseAuthStateMonitor} from '../state/authentication'
import {NotificationContainer} from 'react-notifications'
import Login from '../components/login'
require('react-notifications');

var app = Component({

  render () {
    initializeFirebase();
    startFirebaseAuthStateMonitor();
    let showLogin = this.props.showLoginModal;
    return (
      <div className='container-fluid'>
        <div className="container-fluid">
          <nav className="navbar navbar-default" role="search">
            <div className="navbar-header">
                <a className="navbar-brand" href="/">
                  MIDICONTROL
                </a>
            </div>
            <Login/>
          </nav>
        </div>
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
  showLoginModal: state.authentication.showLoginModal
}));
const WrappedContainer = DragDropContext(HTML5Backend)(app);
export default WrappedContainer

