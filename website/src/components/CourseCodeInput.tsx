import React, { useState, ChangeEvent } from "react";
import './CourseCodeInput.css'; 

const CourseCodeInput: React.FC = () => {
    const [courseCode, setCourseCode] = useState<string>("");

    function handleCodeInput(event: ChangeEvent<HTMLInputElement>): void {
        setCourseCode(event.target.value);
    }

    return (
        <div className="container">
            <label className="input-label">
                Enter a course code: {'(e.g., CS2030S)'}
                <input 
                    type="text" 
                    className="input-field"
                    value={courseCode} 
                    onChange={handleCodeInput} 
                    placeholder="e.g., CS2030S"
                />
            </label>
        </div>
    );
}

export default CourseCodeInput;
