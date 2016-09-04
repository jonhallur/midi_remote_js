import { Component } from 'jumpsuit'
import Input from 'components/input/input'
import {addData} from '../state/test'

const List = Component({
  render() {
    const object_list = this.props.listofstuff;

    return (
        <ul>
          {
            Object.keys(object_list).map(function (key) {
              return <li key={key}>{object_list[key].data}</li>
            })
          }
        </ul>
    )
  }

});

export default Component({
  render () {
    var listofthings = this.props.ready ? <List listofstuff={this.props.data}/> : <span>loading...</span>;
    return (
      <div>
        <h2>Children</h2>
          <div className="form-group">
            <Input onKeyDown={(e) => handleSubmission(e)}/>
          </div>
          {listofthings}
      </div>
    )
  }
}, (state) => ({
  state: state,
  ready: state.firebaseState.ready,
  data: state.firebaseState.data
}))

function handleSubmission(e) {
  if (e.keyCode === 13) {
    addData(e.target.value);
    e.target.value = '';
  }
}
