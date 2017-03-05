/**
 * Created by jonh on 23.10.2016.
 */
import {Component} from 'jumpsuit'
import authentication, {loginEmailUser, signOutUser, createEmailUser, loginGoogleUser, createGoogleUser} from '../state/authentication'
import Modal from 'react-modal'
import Input, {EmailInput} from './input/input'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderRadius          : '5px',
    padding               : '20px',
    width: '300px'
  }
};

export default Component({
  loginUserClick(event) {
    event.preventDefault();
    let {loginEmail, loginPassword} = this.props;
    loginEmailUser(loginEmail, loginPassword);
    authentication.setUsingKeyValue({key: 'showLoginModal', value: false})
  },

  logoutUserClick(event) {
    event.preventDefault();
    signOutUser()
  },

  onGoogleLoginClick(event) {
    event.preventDefault();
    loginGoogleUser();
  },

  onGoogleSignUpClick(event) {
    event.preventDefault();
    loginGoogleUser();
  },

  signUpUserClick(event) {
    event.preventDefault();
    let {loginEmail, loginPassword} = this.props;
    createEmailUser(loginEmail, loginPassword);
    authentication.setUsingKeyValue({key: 'showLoginModal', value: false})
  },

  render () {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let inputValid = this.props.loginEmail.match(emailRegex) && this.props.loginPassword;
    return (
      <div className="nav navbar-right">
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
          onRequestClose={e => authentication.setUsingKeyValue({key: 'showLoginModal', value: false})}
          closeTimeoutMS={10}
          style={customStyles}
          contentLabel="Login"
        >

          <h1>Sign In</h1>
          <form className="form-horizontal">
            <div className="form-group">
              <button
                type="button"
                className="btn btn-block btn-social btn-google"
                onClick={this.onGoogleSignUpClick}
              >
                <span className="fa fa-google"/>Using Google
              </button>
              <button
                type="button"
                className="btn btn-block btn-default"
                onClick={event => authentication.setUsingKeyValue({key: 'showEmailLogin', value: !this.props.showEmailLogin})}
              >
                Using Email
              </button>
            </div>
            <div className={this.props.showEmailLogin ? 'collapse in' : 'collapse'}>
              <EmailInput
                id="loginEmail"
                placeholder="Email"
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
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={!inputValid}
                    onClick={this.loginUserClick}
                  >Email Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-default btn-block"
                    disabled={!inputValid}
                    value="Submit"
                    onClick={this.signUpUserClick}
                  >Email Signup
                  </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    )
  }
}, (state) => ({
  user: state.authentication.user,
  userName: state.authentication.userName,
  showLoginModal: state.authentication.showLoginModal,
  loginPassword: state.authentication.loginPassword,
  loginEmail: state.authentication.loginEmail,
  showEmailLogin: state.authentication.showEmailLogin
}))