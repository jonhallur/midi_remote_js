import { Component } from 'jumpsuit'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {initializeFirebase} from '../state/test'
import {NotificationContainer} from 'react-notifications'

var app = Component({

  render () {
    initializeFirebase();
    return (
      <div className='container'>
        <NotificationContainer/>
          {this.props.children}
      </div>
    )
  }
});
const WrappedContainer = DragDropContext(HTML5Backend)(app);
export default WrappedContainer