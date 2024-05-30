// import React, { useState } from 'react';
// import ModuleForm from "../../../data/fetchModuleInfo";
// import DynamicTable from "./DynamicTable";
// import Card from "./Card";

// export function CardAdder() {
//     const [moduleInfo, setModuleInfo] = useState(null);
//     const [selectedColumn, setSelectedColumn] = useState<number>(0);

//     // Function to handle adding a new card to the selected column
//     const addCardToTable = () => {
//         if (moduleInfo) {
//             // Assume DynamicTable has a method to add cards externally
//             DynamicTable.addCard(selectedColumn, {
//                 id: Date.now(), // Unique ID for the card
//                 name: moduleInfo.courseCode, // Course code as name
//                 content: moduleInfo.courseName // Course name as content
//             });
//             setModuleInfo(null); // Clear the current module info after adding
//         }
//     };

//     return (
//         <div>
//             <ModuleForm setModuleInfo={setModuleInfo} />
//             {moduleInfo && (
//                 <div>
//                     <h2>Module Information:</h2>
//                     <p><strong>Course Code:</strong> {moduleInfo.courseCode}</p>
//                     <p><strong>Course Name:</strong> {moduleInfo.courseName}</p>
//                     <p>Select the semester to add the module:</p>
//                     <select onChange={e => setSelectedColumn(parseInt(e.target.value))} value={selectedColumn}>
//                         {Array.from({ length: 12 }, (_, i) => i).map(sem => (
//                             <option key={sem} value={sem}>{`Year ${Math.floor(sem / 2) + 1} Sem ${sem % 2 + 1}`}</option>
//                         ))}
//                     </select>
//                     <button onClick={addCardToTable}>Add Module to Table</button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CardAdder;
