/**
 * Created by jonh on 24.1.2017.
 */
import {Component} from 'jumpsuit'

export default Component({
  render () {
    console.log(this.props.user);
    return (
      <div>
        {
          this.props.user.providerData.map((provider, index) => (
            <Provider key={index} provider={provider} />
          ))
        }

      </div>
    )
}}, (state) => ({
  user: state.authentication.user
}))

const Provider = (props) => {
  let {provider} = props;
  return (
    <div>
      <div className="row">
        <div className="col-sm-2">
          <strong>Display Name:</strong>
        </div>
        <div className="col-sm-10">
          {provider.displayName}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-2">
          <strong>Email:</strong>
        </div>
        <div className="col-sm-10">
          {provider.email}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-2">
          <strong>Provider:</strong>
        </div>
        <div className="col-sm-10">
          {provider.providerId}
        </div>
      </div>
    </div>
  )
};