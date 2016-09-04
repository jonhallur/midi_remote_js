import React from 'react';
import { DragSource } from 'react-dnd';
import {Component} from 'jumpsuit'

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
const Types = {
    CARD: 'card'
};

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const cardSource = {
    canDrag(props) {
        // You can disallow drag based on props
        return props.isReady;
    },

    isDragging(props, monitor) {
        console.log("is dragging");
        // If your component gets unmounted while dragged
        // (like a card in Kanban board dragged between lists)
        // you can implement something like this to keep its
        // appearance dragged:
        return monitor.getItem().id === props.id;
    },

    beginDrag(props, monitor, component) {
        // Return the data describing the dragged item
        console.log("begin");
        return { id: props.id };
    },

    endDrag(props, monitor, component) {
        console.log("end drag");
        if (!monitor.didDrop()) {
            // You can check whether the drop was successful
            // or if the drag ended but nobody handled the drop
            return;
        }

        // When dropped on a compatible target, do something.
        // Read the original dragged item from getItem():
        const item = monitor.getItem();

        // You may also read the drop result from the drop target
        // that handled the drop, if it returned an object from
        // its drop() method.
        const dropResult = monitor.getDropResult();

        // This is a good place to call some Flux action
        CardActions.moveCardToList(item.id, dropResult.listId);
    }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
    console.log("connect", connect.dragSource());
    console.log("monitor", monitor.internalMonitor);
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

var Card = Component({
    render() {
        // Your component receives its own props as usual
        const { id } = this.props;
        // These props are injected by React DnD,
        // as defined by your `collect` function above:
        const { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div>
                I am a draggable card number {id}
                <span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
            </div>
        );
    }
});

export default DragSource(Types.CARD, cardSource, collect)(Card);