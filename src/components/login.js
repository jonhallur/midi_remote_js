/**
 * Created by jonh on 23.10.2016.
 */
import {Component} from 'jumpsuit'
import authentication, {loginEmailUser, signOutUser, createEmailUser} from '../state/authentication'
import Modal from 'react-modal'
import Input from './input/input'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderRadius          : '5px',
    padding               : '20px'

  }
};

export default Component({
  loginUserClick(event) {
    let {loginEmail, loginPassword} = this.props;
    loginEmailUser(loginEmail, loginPassword);
    authentication.setUsingKeyValue({key: 'showLoginModal', value: false})
  },

  logoutUserClick(event) {
    signOutUser()
  },

  signupUserClick(event) {
    let {loginEmail, loginPassword} = this.props;
    createEmailUser(loginEmail, loginPassword);
    authentication.setUsingKeyValue({key: 'showLoginModal', value: false})

  },

  render () {
    let inputValid = this.props.loginEmail && this.props.loginPassword;
    return (
      <div className="navbar-right">
        {this.props.user ?
        <p className="navbar-text">Logout&nbsp;
          <a
            href="#"
            onClick={this.logoutUserClick}
          >{this.props.user.email}</a>&nbsp;
        </p>
          :
        <p className="navbar-text">
          <a
            href="#"
            onClick={event => authentication.setUsingKeyValue({key: 'showLoginModal', value: true})}
          >Login</a>&nbsp;
        </p>
        }
        <Modal
          isOpen={this.props.showLoginModal}
          onAfterOpen={e => console.log("on after open")}
          onRequestClose={e => authentication.setUsingKeyValue({key: 'showLoginModal', value: false})}
          closeTimeoutMS={10}
          style={customStyles}>

          <h1>Login</h1>
          <form className="form-horizontal">
            <Input
              id="loginEmail"
              placeholder="Name"
              type="text"
              value={this.props.loginEmail}
              onChange={e => authentication.setUsingKeyValue({key: 'loginEmail', value: e.target.value})}
            />
            <Input
              id="loginPassword"
              placeholder="Pass"
              type="password"
              value={this.props.loginPassword}
              onChange={e => authentication.setUsingKeyValue({key: 'loginPassword', value: e.target.value})}

            />
            <div className="form-group">
              <p>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  disabled={!inputValid}
                  onClick={this.loginUserClick}
                >Login</button>
                <button
                  type="button"
                  className="btn btn-default btn-block"
                  disabled={!inputValid}
                  onClick={this.signupUserClick}
                >Signup</button>
              </p>
            </div>
          </form>
        </Modal>
      </div>
    )
}}, (state) => ({
  user: state.authentication.user,
  userName: state.authentication.userName,
  showLoginModal: state.authentication.showLoginModal,
  loginPassword: state.authentication.loginPassword,
  loginEmail: state.authentication.loginEmail
}))