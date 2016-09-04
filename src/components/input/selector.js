/**
 * Created by jonhallur on 3.9.2016.
 */
import {Component} from 'jumpsuit'

export default Component({
    render() {
        var data = this.props.data;
        return (
            <div className="form-group">
                <label htmlFor={this.props.id} className="col-sm-2 control-label">{this.props.label}</label>
                <div className="col-sm-10">
                    <select className="form-control" id={this.props.id} ref={this.props.id} value={this.props.value} onChange={this.props.eventhandler} >
                        <option disabled value>{this.props.default_text}</option>
                        {Object.keys(data).map(key =>
                            <Option key={key} id={key} name={data[key].name}/>
                        )}
                    </select>
                </div>
            </div>
        );
    }
})

const Option = Component({
    render() {
        return (
            <option key={this.props.id} value={this.props.id}>{this.props.name}</option>
        )
    }
});