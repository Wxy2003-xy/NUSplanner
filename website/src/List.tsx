// Import React and Module type
import React from 'react';
import { Module } from './types/modules';  // Path might need adjustment based on actual file location

type ItemListProps = {
    modules: Module[];  // Array of Module objects
};

const ItemList: React.FC<ItemListProps> = ({ modules }) => {
    return (
        <ul>
            {modules.map((module) => (
                <li key={module.moduleCode}>
                    {module.title}: &nbsp;
                    <b>{module.moduleCredit}</b>
                </li>
            ))}
        </ul>
    );
};

export default ItemList;
