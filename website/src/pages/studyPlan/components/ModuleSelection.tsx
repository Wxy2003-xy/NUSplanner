import React, { useState, useEffect } from 'react';
import PrereqTreeVisual from './TreeVisualization';
import { ModuleInfo, ModuleSelectionBoxProps, ExamInfo } from '../../../types/general';

const ModuleSelectionBox: React.FC<ModuleSelectionBoxProps> = ({ setTempCard, onConfirm, onClose }) => {
    const [acadYear, setAcadYear] = useState<string>(() => {
        return localStorage.getItem('acadYear') || '';
    });
    const [moduleCode, setModuleCode] = useState<string>('');
    const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moduleList, setModuleList] = useState<{ moduleCode: string, title: string }[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        localStorage.setItem('acadYear', acadYear);
    }, [acadYear]);

    useEffect(() => {
        if (acadYear) {
            fetchModuleList(acadYear);
        }
    }, [acadYear]);

    const fetchModuleList = (acadYear: string) => {
        const nextYear = parseInt(acadYear.split('-')[0], 10) + 1;
        const apiUrl_modulelist = `https://api.nusmods.com/v2/${acadYear.split('-')[0]}-${nextYear}/moduleList.json`;

        fetch(apiUrl_modulelist)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const modules = data.map((module: { moduleCode: string, title: string }) => ({
                    moduleCode: module.moduleCode,
                    title: module.title
                }));
                setModuleList(modules);
            })
            .catch(error => {
                console.error('Error fetching module list:', error);
                setError('Failed to fetch module list.');
            });
    };

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

    const handleModuleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.toUpperCase();
        setModuleCode(input);
        if (input.length >= 2) {
            const filteredSuggestions = moduleList
                .filter(module => module.moduleCode.startsWith(input))
                .slice(0, 5)
                .map(module => `${module.moduleCode} - ${module.title}`);
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const moduleCode = suggestion.split(' - ')[0];
        setModuleCode(moduleCode); // Autofill the input field
        setSuggestions([]); // Clear the suggestions list
    };

    const fetchModuleInfo = (acadYear: string, moduleCode: string): void => {
        if (!acadYear) {
            setError('Please select an academic year.');
            return;
        }

        const nextYear = parseInt(acadYear.split('-')[0], 10) + 1;
        const apiUrl_moduleinfo = `https://api.nusmods.com/v2/${acadYear.split('-')[0]}-${nextYear}/modules/${moduleCode}.json`;
        setIsLoading(true);

        fetch(apiUrl_moduleinfo)
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
                    semester: data.semesterData.map(data => data.semester),
                    content: data.title,
                    courseCredit: data.moduleCredit,
                    prereqTree: data.prereqTree,
                    preclusionRule: extractCourseCodes(data.preclusionRule),
                    examInfo: data.semesterData.map(data => {
                        return {
                            examTime: data.examDate,
                            examDuration: data.examDuration
                        };
                    })
                };
                setTempCard(card);
                setModuleInfo(card);
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        fetchModuleInfo(acadYear, moduleCode);
    };

    return (
        <div className="module-selection-overlay show">
            <button className="close-module-selection" onClick={onClose}>Close</button>
            <form onSubmit={handleSubmit}>
                <label>
                    Academic Year: {'   '}
                    <select
                        id="acadYear"
                        name="acadYear"
                        value={acadYear}
                        onChange={e => setAcadYear(e.target.value)}
                        required
                    >
                        <option value="">Select Academic Year</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2022-2023">2022-2023</option>
                        <option value="2021-2022">2021-2022</option>
                    </select> 
                </label>
                <p className='notice-info-relevance'>{'  '} Note: Planning beyond current academic year will use course information of the most recent acadamic year, which may be subjected to changes in the future.</p>
                <label>
                    Module Code (e.g., CS1101S): {'   '}
                    <input
                        type="text"
                        id="moduleCode"
                        name="moduleCode"
                        value={moduleCode}
                        onChange={handleModuleCodeChange}
                        required
                    />
                </label>
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                <button className='fetchinfo-button' type="submit">Search</button>
            </form>
            {isLoading && <p>Loading...</p>}
            {error && (
                <div style={{ color: 'red' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
            {moduleInfo && (
                <div className='info-text'>
                    <div>
                        <h2>Module Information:</h2>
                        <h3>{moduleInfo.courseCode}</h3>
                        <p><strong>Credit:</strong> {moduleInfo.courseCredit}</p>
                        <p><strong>Prerequisites:</strong> {moduleInfo.prerequisites}</p>
                        <p><strong>Preclusions:</strong> {moduleInfo.preclusionRule ? moduleInfo.preclusionRule.join(', ') : 'NA'}</p>
                    </div>
                    <div>
                        <div className='tree-container-select'>
                            <PrereqTreeVisual data={moduleInfo.prereqTree} />
                        </div>
                        <button className='confirm-button' onClick={onConfirm}>Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleSelectionBox;
