import React, { useState, FormEvent, useEffect } from 'react';
import { PrereqTree } from '../types/modules';
import PrereqTreeComponent from '../util/visualiser';
import { tokenize, parseTokens } from '../util/parser';

interface ModuleInfo {
    courseCode: string;
    courseName: string;
    courseCredit: number;
    preclusions: string;
    preclusionRule: string;
    prerequisites: string;
    prerequisiteRule: string;
    prereqTree?: string; // Optional detailed prerequisite tree visualization
}

interface ModuleFormProps {
    setTempCard: (card: { 
        id: number; 
        name: string; 
        content: string; 
        courseCredit: number; 
        prereqTree?: string | undefined | null}) => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ setTempCard }) => {
    const [acadYear, setAcadYear] = useState<string>(() => {
        return localStorage.getItem('acadYear') || '';
    });
    const [moduleCode, setModuleCode] = useState<string>('');
    const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateAcadYear = (year: string): boolean => {
        return /^\d{4}$/.test(year); // Checks if the year is a four-digit number
    };

    useEffect(() => {
        localStorage.setItem('acadYear', acadYear);
    }, [acadYear]);

    const fetchModuleInfo = (acadYear: string, moduleCode: string): void => {
        if (!validateAcadYear(acadYear)) {
            setError('Invalid academic year format. Please enter a four-digit year (e.g., 2023).');
            setModuleInfo(null);
            return;
        }

        const nextYear = parseInt(acadYear, 10) + 1;
        const apiUrl = `https://api.nusmods.com/v2/${acadYear}-${nextYear}/modules/${moduleCode}.json`;
        setIsLoading(true);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setModuleInfo({
                    courseCode: data.moduleCode,
                    courseName: data.title,
                    courseCredit: data.moduleCredit,
                    preclusions: data.preclusion,
                    preclusionRule: data.preclusionRule,
                    prerequisites: data.prerequisite,
                    prerequisiteRule: data.prerequisiteRule,
                    prereqTree: JSON.stringify(data.prereqTree) // Assuming 'prereqTree' might be a part of the data
                });
                console.log(moduleInfo);
                const card = {
                    id: Date.now(),
                    name: data.moduleCode,
                    content: data.title,
                    courseCredit: data.moduleCredit,
                    prereqTree: JSON.stringify(data.prereqTree)
                };
                console.log("Setting tempCard:", card); // Debugging log
                setTempCard(card);

                setError('');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setModuleInfo(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        fetchModuleInfo(acadYear, moduleCode);
    };

    const infoBlockStyle = {
        color: '#333',
        backgroundColor: '#69c9a3',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        margin: '20px auto',
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    };

    return (
        <div style={infoBlockStyle}>
            <h1>Fetch Module Information</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Academic Year (e.g., 2023):
                    <input
                        type="text"
                        value={acadYear}
                        onChange={e => setAcadYear(e.target.value)}
                        required
                    />
                </label>
                <p></p>
                <label>
                    Module Code (e.g., CS1101S):
                    <input
                        type="text"
                        value={moduleCode}
                        onChange={e => setModuleCode(e.target.value.toLocaleUpperCase())}
                        required
                    />
                </label>
                <button type="submit">Fetch Module Info</button>
            </form>
            {isLoading && <p>Loading...</p>}
            {error && (
                <div style={{ color: 'red' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
            {moduleInfo && (
                <div>
                    <h2>Module Information:</h2>
                    <h3>{moduleInfo.courseCode} {moduleInfo.courseName}</h3>
                    <p><strong>Credit:</strong> {moduleInfo.courseCredit}</p>
                    <p><strong>Prerequisites:</strong> {moduleInfo.prerequisites}</p>
                    <p><strong>Prerequisite Rule:</strong> {moduleInfo.prerequisiteRule}</p>
                    <p><strong>Preclusions:</strong> {moduleInfo.preclusions}</p>
                    <p><strong>Preclusion Rule:</strong> {moduleInfo.preclusionRule}</p>
                    <p><strong>Prereq tree:</strong> {moduleInfo.prereqTree}</p>
                    {<div>
                        <h3>Prerequisite Tree:</h3>
                        <PrereqTreeComponent node={parseTokens(tokenize(moduleInfo.prerequisites))} />
                    </div> }
                    <p>here</p>
                </div>
            )}
        </div>
    );
};

export default ModuleForm;
