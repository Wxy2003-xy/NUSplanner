import React, { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react';
import './program.css'
interface ProgramProps {
  faculty: string;
  program: string;
}
const soc = [
    { id: 0, name: ''},
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Business Analytics' },
    { id: 3, name: 'Information System' },
    { id: 4, name: 'Information Security' }
];

const chsas = [
    { id: 0, name: ''},
    { id: 1, name: 'Chinese Language' },
    { id: 2, name: 'Chinese Studies' },
    { id: 3, name: 'English Language and Linguistics' },
    { id: 4, name: 'English Literature' },
    { id: 5, name: 'Global Studies'},
    { id: 6, name: 'History'},
    { id: 7, name: 'Japanese Studies'},
    { id: 8, name: 'Malay Studies'},
    { id: 9, name: 'Philosophy'},
    { id: 10, name: 'South Asian Studies'},
    { id: 11, name: 'Southeast Asian Studies'},
    { id: 12, name: 'Theatre and Performance Studies'}
];

const chsh = [
    { id: 0, name: ''},
    { id: 1, name: 'Anthropology' },
    { id: 2, name: 'Communications and New Media' },
    { id: 3, name: 'Economics' },
    { id: 4, name: 'Geography' },
    { id: 5, name: 'Political Science'},
    { id: 6, name: 'Psychology'},
    { id: 7, name: 'Social Work'},
    { id: 8, name: 'Sociology'}
];

const fos = [
    { id: 0, name: ''},
    { id: 1, name: 'Chemistry' },
    { id: 2, name: 'Data Science and Analytics' },
    { id: 3, name: 'Food Science and Technology' },
    { id: 4, name: 'Life Sciences' },
    { id: 5, name: 'Mathematics'},
    { id: 6, name: 'Pharmaceutical Science'},
    { id: 7, name: 'Physics'},
    { id: 8, name: 'Quantitative Finance'},
    { id: 9, name: 'Statistics'}
];

const cde = [
    { id: 0, name: ''},
    { id: 1, name: '' },
    { id: 2, name: '' },
    { id: 3, name: '' },
    { id: 4, name: '' }
];

const biz = [
    { id: 0, name: ''},
    { id: 1, name: 'Business Administration' }
];

const nil = [
    {id: 1, name: 'Not Applicable'}
]

const ProgramTab: React.FC<ProgramProps> = ({ faculty, program}) => {

  const allPrograms = {
    'School of Computing': soc,
    'College of Humanities and Sciences, Asian Studies': chsas,
    'College of Humanities and Sciences, Humanities': chsh,
    'College of Humanities and Sciences, Sciences': fos,
    'College of Design and Engineering': cde,
    'Business School': biz,
    'Others': nil
};
  
    const [selectedMajor, setSelectedMajor] = useState<string>('');
    const [secondMajor, setSecondMajor] = useState<string>('');
    const [secondFaculty, setSecondFaculty] = useState<string>('School of Computing');
    const [programs, setPrograms] = useState(allPrograms[faculty] || nil);
    const [secondPrograms, setSecondPrograms] = useState(allPrograms[secondFaculty]);

    

    useEffect(() => {
      setPrograms(allPrograms[faculty]);
      setSelectedMajor(allPrograms[faculty][0]?.name || 'Not Applicable');
    }, [faculty, allPrograms]);
    

    useEffect(() => {
      setSecondPrograms(allPrograms[secondFaculty]);
      setSecondMajor(allPrograms[secondFaculty][0]?.name || 'Not Applicable');
    }, [secondFaculty, allPrograms]);

    const handleMajorChange = (event: ChangeEvent<HTMLSelectElement>) => {
      console.log("Before updating selectedMajor:", selectedMajor);
      setSelectedMajor(event.target.value);
      console.log("After updating selectedMajor:", event.target.value);
    };    
    
    const handleSecondFacultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setSecondFaculty(event.target.value);
    };

    const handleSecondMajorChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setSecondMajor(event.target.value);
    };

    useEffect(() => {
      localStorage.setItem('secondMajor', secondMajor);
    }, [secondMajor]);
  switch (program) {
    case 'Single Degree Program': return (
      <>
        <select className="major-drop-down-list"value={selectedMajor} onChange={handleMajorChange}>
          {programs.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name || 'Not Applicable'}
            </option>
          ))}
        </select>
      <h1>Study Plan for {selectedMajor}</h1>
    </>
    );
    case 'Single Degree with 2nd Major Program': return (
      <>
        <select className="major-drop-down-list1"value={selectedMajor} onChange={handleMajorChange}>
          {programs.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name || 'Not Applicable'}
            </option> 
            ))}
        </select>
        <select className="second-faculty-dropdown-list" value={secondFaculty} onChange={handleSecondFacultyChange}>
          {['School of Computing', 

            'College of Humanities and Sciences, Asian Studies', 
            'College of Humanities and Sciences, Humanities', 
            'College of Humanities and Sciences, Sciences', 

            'College of Design and Engineering',
            'Business School',
            'Others'].map(faculty => (
            <option key={faculty} value={faculty}>{`${faculty}`}</option>
          ))}
        </select>
        <select className="major-drop-down-list1"value={secondMajor} onChange={handleSecondMajorChange}>
          {secondPrograms.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name || 'Not Applicable'}
            </option>
          ))}
        </select>
        <h1>Study Plan for {selectedMajor} and {secondMajor}</h1>
      </>
    );
    case 'Double or Concurrent Degree program': return (
      <>
        <select className="major-drop-down-list3"value={selectedMajor} onChange={handleMajorChange}>
          {programs.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name || 'Not Applicable'}
            </option>
            ))}
        </select>
        <select className="second-faculty-dropdown-list" value={secondFaculty} onChange={handleSecondFacultyChange}>
          {['School of Computing', 

            'College of Humanities and Sciences, Asian Studies', 
            'College of Humanities and Sciences, Humanities', 
            'College of Humanities and Sciences, Sciences', 

            'College of Design and Engineering',
            'Business School',
            'Others'].map(faculty => (
            <option key={faculty} value={faculty}>{`${faculty}`}</option>
          ))}
        </select>
        <select className="major-drop-down-list4" value={secondMajor} onChange={handleSecondMajorChange}>
          {secondPrograms.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name || 'Not Applicable'}
            </option>
          ))}
        </select>
        <h1>Study Plan for {selectedMajor} and {secondMajor}</h1>
      </>
    );

  }
}

export default ProgramTab