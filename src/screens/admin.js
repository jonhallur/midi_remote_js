/**
 * Created by jonhallur on 16.8.2016.
 */
import { Component, IndexLink } from 'jumpsuit'

export default Component({
    render () {
        if(this.props.user && this.props.userIsAdmin) {
            return (
              <div>
                  <nav className="navbar navbar-defualt">
                      <div className="navbar-header">
                          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                              <span className="sr-only">Toggle navigation</span>
                              <span className="icon-bar"/>
                              <span className="icon-bar"/>
                              <span className="icon-bar"/>
                          </button>
                          <a className="navbar-brand" href="/admin">ADMIN</a>
                      </div>
                      <ul className="nav nav-tabs">
                          <li className="presentation">
                              <IndexLink to="/admin/manufacturers">Manufacturers</IndexLink>
                          </li>
                          <li className="presentation">
                              <IndexLink to="/admin/sysexheaders">SysEx Headers</IndexLink>
                          </li>
                          <li className="presentation">
                              <IndexLink to="/admin/synthremotes">Synth Remotes</IndexLink>
                          </li>

                      </ul>
                  </nav>

                  {this.props.children}
              </div>
            )
        }
        else {
            return (
              <div><h3>You are not Authorized to view this page</h3></div>
            )
        }

    }
}, (state) => ({
    user: state.authentication.user,
    userIsAdmin: state.authentication.userIsAdmin
}))