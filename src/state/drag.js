/**
 * Created by jonhallur on 29.8.2016.
 */
import {State} from 'jumpsuit'
const drag = State('manufacturers', {
    initial: {
        isDragging: false,
        connectDragSource: undefined
    }
});

export default drag