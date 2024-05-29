import React from 'react';

interface PrereqTree {
    courseCode?: string;
    logicalOp?: string;
    relationship?: string;
    minRequired?: number;
    branches: PrereqTree[];
}

interface PrereqTreeProps {
    node: PrereqTree;
}

const PrereqTreeComponent: React.FC<PrereqTreeProps> = ({ node }) => {
    return (
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            {node.courseCode && <div>Course: {node.courseCode}</div>}
            {node.logicalOp && <div>Operator: {node.logicalOp}</div>}
            {node.relationship && (
                <div>
                    Relationship: {node.relationship} {node.minRequired ? `(${node.minRequired})` : ''}
                </div>
            )}
            {node.branches.length > 0 && (
                <div>
                    {node.branches.map((branch, index) => (
                        <PrereqTreeComponent key={index} node={branch} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrereqTreeComponent;
