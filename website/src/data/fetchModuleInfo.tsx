import React, { useState, FormEvent, useEffect } from 'react';
import PrereqTreeVisual from '../pages/studyPlan/components/TreeVisualization';
import './fetchModuleInfo.css'
import { ModuleInfo, ModuleFormProps, ExamInfo } from '../types/general';

const ModuleForm: React.FC<ModuleFormProps> = ({ setTempCard }) => {
    const [acadYear, setAcadYear] = useState<string>(() => {
        return localStorage.getItem('acadYear') || '';
    });
    const [moduleCode, setModuleCode] = useState<string>('');
    const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateAcadYear = (year: string): boolean => {
        return /^\d{4}$/.test(year); 
    };

    useEffect(() => {
        localStorage.setItem('acadYear', acadYear);
    }, [acadYear]);
    /**
    * parse preclusion rule to structured form for eazy access in preclusion check when add card
    * @param {string} rule - original data form
    * @returns {string[]} return array of strings of course codes
    */
    function extractCourseCodes(rule: string): string[] {
        const coursePattern: RegExp = /\b([A-Z]{2,}[0-9]{4}[A-Z]{0,2}):[A-Z]\b/g;
        let matches: string[] = [];
        let match: RegExpExecArray | null;
        while ((match = coursePattern.exec(rule)) !== null) {
            if (match[1]) { 
                matches.push(match[1]); 
            }
        }
    
        return matches;
    }

    const fetchModuleInfo = (acadYear: string, moduleCode: string): void => {
        if (!validateAcadYear(acadYear)) {
            setError('Invalid academic year format. Please enter a four-digit year (e.g., 2023).');
            setModuleInfo(null);
            return;
        }

        const nextYear = parseInt(acadYear, 10) + 1;
        const apiUrl_moduleinfo = `https://api.nusmods.com/v2/${acadYear}-${nextYear}/modules/${moduleCode}.json`;
        setIsLoading(true);

        fetch(apiUrl_moduleinfo)
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
                    courseSemester: data.semesterData.map(data => data.semester),
                    courseCredit: data.moduleCredit,
                    preclusions: data.preclusion,
                    preclusionRule: extractCourseCodes(data.preclusionRule),
                    prerequisites: data.prerequisite,
                    prerequisiteRule: data.prerequisiteRule,
                    prereqTree: data.prereqTree,
                    examInfo: data.semesterData.map(data => {
                        return {
                            examTime: data.examDate,
                            examDuration: data.examDuration
                        }
                    })
                });
                const card = {
                    id: Date.now(),
                    name: data.moduleCode,
                    semester: data.semesterData.map(data => data.semester),
                    content: data.title,
                    courseCredit: data.moduleCredit,
                    prereqTree: data.prereqTree,
                    preclusionRule: extractCourseCodes(data.preclusionRule),
                    examInfo: data.semesterData.map(data => {
                        return {
                            examTime: data.examDate,    
                            examDuration: data.examDuration
                        }
                    })
                };
                console.log("Setting tempCard:", card);
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
        
        color: 'white',
        backgroundColor: '#0a756d',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        marginBottom: '10px', 
        marginTop: '-5px', 

        width: '94%',
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
                        id="acadYear"  
                        name="acadYear"  
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
                        id="moduleCode"  
                        name="moduleCode"  
                        value={moduleCode}
                        onChange={e => setModuleCode(e.target.value.toLocaleUpperCase())}
                        required
                    />
                </label>
                <button className='fetchinfo-button' type="submit">Fetch Module Info</button>
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
                    {/* <p><strong>Prereq tree:</strong> {JSON.stringify(moduleInfo.prereqTree)}</p> */}
                    <div>
                        <PrereqTreeVisual data={moduleInfo.prereqTree} />
                    </div> 
                </div>
            )}
        </div>
    );
};

export default ModuleForm;
