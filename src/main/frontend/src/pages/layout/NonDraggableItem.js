import React from 'react';

const NonDraggableItem = ({ children }) => {
    return <div style={{ display: 'inline-block' }}>{children}</div>;
};

export default NonDraggableItem;