import React, { useState, FormEvent } from 'react';

interface ModuleInfo {
    preclusions: string;
    preclusionRule: string;
    prerequisites: string;
    prerequisiteRule: string;
}

const ModuleForm: React.FC = () => {
    const [acadYear, setAcadYear] = useState<string>('');
    const [moduleCode, setModuleCode] = useState<string>('');
    const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateAcadYear = (year: string): boolean => {
        return /^\d{4}$/.test(year); // Checks if the year is a four-digit number
    };

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
                const relevantData = {
                    preclusions: data.preclusion,
                    preclusionRule: data.preclusionRule,
                    prerequisites: data.prerequisite,
                    prerequisiteRule: data.prerequisiteRule
                };
                setModuleInfo(relevantData);
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
        color: 'white',
        backgroundColor: 'black',
        padding: '10px',
        fontFamily: 'Arial',
        margin: '20px auto',
        width: '80%',
        borderRadius: '8px'
    };

    return (
        <>
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
                    <p><strong>Prerequisites:</strong> {moduleInfo.prerequisites}</p>
                    <p><strong>Prerequisite Rule:</strong> {moduleInfo.prerequisiteRule}</p>
                    <p><strong>Preclusions:</strong> {moduleInfo.preclusions}</p>
                    <p><strong>Preclusion Rule:</strong> {moduleInfo.preclusionRule}</p>
                </div>
            )}
        </div>
        </>
    );
};

export default ModuleForm;
