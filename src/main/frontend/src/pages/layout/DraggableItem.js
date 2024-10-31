import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ data, type, children }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'ITEM',
        item: { data, type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1, display: 'inline-block' }}
        >
            {children}
        </div>
    );
};

export default DraggableItem;