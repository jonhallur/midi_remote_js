import {Component} from 'jumpsuit'

export default Component({
    render() {
        return (
            <div className="form-group">
                <label
                    htmlFor={this.props.id}
                    className="col-sm-2 control-label"
                >{this.props.label}</label>
                <div className="col-sm-10">
                    <select
                        className="form-control"
                        id={this.props.id}
                        ref={this.props.id}
                        value={this.props.value}
                        onChange={this.props.eventhandler} >
                        <option disabled value="">{this.props.default_text}</option>
                        {this.props.data.map(item =>
                            <Option key={item.value} id={item.value} name={item.name}/>
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