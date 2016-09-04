/**
 * Created by jonhallur on 17.8.2016.
 */
export default (props) => {
    return (
        <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            id={props.id}
                            checked={props.checked}
                            onChange={props.onChange}
                        />{props.label}
                    </label>
                </div>
            </div>
        </div>

    )
}