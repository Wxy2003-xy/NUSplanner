// import React, { useState } from 'react';

// // TreeNode interface definition
// interface TreeNode<T> {
//     value: T;
//     children: TreeNode<T>[];
// }

// // Example component to display and manipulate a tree
// const TreeComponent: React.FC = () => {
//     const [root, setRoot] = useState<TreeNode<string> | null>(null);

//     // Function to add a node to the tree
//     const addNode = (parent: TreeNode<string> | null, value: string): TreeNode<string> => {
//         const newNode: TreeNode<string> = { value: value, children: [] };
//         if (parent === null) {
//             setRoot(newNode);
//         } else {
//             parent.children.push(newNode);
//         }
//         return newNode;
//     };

//     // Recursive function to display the tree
//     const renderTree = (node: TreeNode<string> | null): JSX.Element | null => {
//         if (node === null) return null;
//         return (
//             <ul>
//                 <li>
//                     {node.value}
//                     {node.children && <ul>{node.children.map(child => renderTree(child))}</ul>}
//                 </li>
//             </ul>
//         );
//     };

//     // Example usage within the component
//     const handleAddNode = () => {
//         if (root === null) {
//             addNode(null, 'Root Node');
//         } else {
//             addNode(root, 'Child Node');
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleAddNode}>Add Node</button>
//             {renderTree(root)}
//         </div>
//     );
// };

// export default TreeComponent;
