import React, { useState, FormEvent, useEffect } from 'react';
import { PrereqTree } from '../types/modules';
import { PrereqTreeMap } from '../../scrapers/nus-v2/src/services/requisite-tree';
import PrereqTreeComponent from '../util/visualiser';
import {createEmptyPrereqTree, tokenize, parseTokens} from '../util/parser';
interface ModuleInfo {
    courseCode: string;
    courseName: string;
    preclusions: string;
    preclusionRule: string;
    prerequisites: string;
    prerequisiteRule: string;
    prereqTree?: PrereqTree; // Optional detailed prerequisite tree visualization
}

interface Prereq {
    prerequisites: string;
    prerequisiteRule: string;
}

interface Props {
    year?: number;
    prereqTreeMap?: PrereqTreeMap; // Optional prerequisite tree map passed from parent
}

interface ModuleFormProps {
    setTempCard: (card: { id: number; name: string; content: string }) => void;
}


const ModuleForm: React.FC<ModuleFormProps> = ({ setTempCard }) => {
    const [acadYear, setAcadYear] = useState<string>(() => {
        // Retrieve the academic year from local storage if available
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
        // Save acadYear to local storage whenever it changes
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
                const card = {
                    id: Date.now(),
                    name: data.moduleCode,
                    content: data.title
                };
                setTempCard(card); // Set the temporary card with the fetched data
                setModuleInfo(data);
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

    // Styling remains the same
    const infoBlockStyle = {
        color: 'white',
        backgroundColor: 'grey',
        padding: '10px',
        fontFamily: 'Arial',
        margin: '20px auto',
        width: '100%',
        borderRadius: '8px'
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
                <label>
                    Module Code (e.g., CS1101S):
                    <input
                        type="text"
                        value={moduleCode}
                        onChange={e => setModuleCode(e.target.value)}
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
                    <p><strong>Prerequisites:</strong> {moduleInfo.prerequisites}</p>
                    <p><strong>Prerequisite Rule:</strong> {moduleInfo.prerequisiteRule}</p>
                    <p><strong>Preclusions:</strong> {moduleInfo.preclusions}</p>
                    <p><strong>Preclusion Rule:</strong> {moduleInfo.preclusionRule}</p>
                    {/* {moduleInfo.prereqTree && (
                        <div>
                            <h3>Prerequisite Tree:</h3>
                            <PrereqTreeComponent node={parseTokens(tokenize(moduleInfo.prerequisites))} />
                        </div>
                    )} */}
                    <PrereqTreeComponent node={parseTokens(tokenize(moduleInfo.prerequisites))} />
                </div>
            )}
        </div>
    );
};

export default ModuleForm;
