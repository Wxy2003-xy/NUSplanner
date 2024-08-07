import React from 'react';
import './Card.css';
import classnames from 'classnames';
import { CardProps } from '../../../types/studyplan';

const colorPalettes = {
  ashes: {
    "University level requirement": '#B0B6AB',
    "Faculty level requirement": '#D0D3CD',
    "Major (towards primary degree) requirement": '#A9B9A3',
    "Major (towards 2nd degree/major) requirement": '#A3B9C1',
    "Minor requirement": '#A8C3D5',
    "Unrestricted Elective": '#C1B6C7',
    "Specialisation Primary": '#D7B9C2',
    "Specialisation Elective": '#b38b97',
    default: '#d1d1d1'
  },
  chalk: {
    "University level requirement": '#F0B6AC',
    "Faculty level requirement": '#E8C9A4',
    "Major (towards primary degree) requirement": '#D9E3B4',
    "Major (towards 2nd degree/major) requirement": '#B3CFA9',
    "Minor requirement": '#92CEBE',
    "Unrestricted Elective": '#A3AFCF',
    "Specialisation Primary": '#C4B4C7',
    "Specialisation Elective": '#C4B4C7',
    default: '#d1d1d1'
  },
  eighties: {
    "University level requirement": '#F0999A',
    "Faculty level requirement": '#F5CB7C',
    "Major (towards primary degree) requirement": '#A6CC8C',
    "Major (towards 2nd degree/major) requirement": '#78BCC9',
    "Minor requirement": '#9B9BCB',
    "Unrestricted Elective": '#A58879',
    "Specialisation Primary": '#E8A77A',
    "Specialisation Elective": '#E8A77A',
    default: '#d1d1d1'
  },
  google: {
    "University level requirement": '#DB4437',
    "Faculty level requirement": '#F4B400',
    "Major (towards primary degree) requirement": '#0F9D58',
    "Major (towards 2nd degree/major) requirement": '#4285F4',
    "Minor requirement": '#DB4C88',
    "Unrestricted Elective": '#F0E68C',
    "Specialisation Primary": '#F0E68C',
    "Specialisation Elective": '#F0E68C',
    default: '#d1d1d1'
  },
  mocha: {
    "University level requirement": '#A86C6B',
    "Faculty level requirement": '#DAB18E',
    "Major (towards primary degree) requirement": '#A7B384',
    "Major (towards 2nd degree/major) requirement": '#87B3A5',
    "Minor requirement": '#A2938C',
    "Unrestricted Elective": '#B0A3A2',
    "Specialisation Primary": '#C5A897',
    "Specialisation Elective": '#C5A897',
    default: '#d1d1d1'
  },
  monokai: {
    "University level requirement": '#F92672',
    "Faculty level requirement": '#FD971F',
    "Major (towards primary degree) requirement": '#E6DB74',
    "Major (towards 2nd degree/major) requirement": '#A6E22E',
    "Minor requirement": '#66D9EF',
    "Unrestricted Elective": '#9E6FFE',
    "Specialisation Primary": '#A2A2A2',
    "Specialisation Elective": '#A2A2A2',
    default: '#d1d1d1'
  },
  ocean: {
    "University level requirement": '#AB6A5B',
    "Faculty level requirement": '#D1B29B',
    "Major (towards primary degree) requirement": '#A5B2A2',
    "Major (towards 2nd degree/major) requirement": '#7E9AA2',
    "Minor requirement": '#9C94B0',
    "Unrestricted Elective": '#B0A3A2',
    "Specialisation Primary": '#D3B9A2',
    "Specialisation Elective": '#D3B9A2',
    default: '#d1d1d1'
  },
  oceanicNext: {
    "University level requirement": '#F77669',
    "Faculty level requirement": '#F9CE6E',
    "Major (towards primary degree) requirement": '#ACD2A8',
    "Major (towards 2nd degree/major) requirement": '#7ECCE7',
    "Minor requirement": '#A8A0C9',
    "Unrestricted Elective": '#D1B18B',
    "Specialisation Primary": '#E0D1B0',
    "Specialisation Elective": '#E0D1B0',
    default: '#d1d1d1'
  },
  paraiso: {
    "University level requirement": '#FF3D3E',
    "Faculty level requirement": '#FE9E59',
    "Major (towards primary degree) requirement": '#FAE054',
    "Major (towards 2nd degree/major) requirement": '#50CB89',
    "Minor requirement": '#3EACFF',
    "Unrestricted Elective": '#8959A8',
    "Specialisation Primary": '#FE3E7D',
    "Specialisation Elective": '#FE3E7D',
    default: '#d1d1d1'
  },
  railscasts: {
    "University level requirement": '#F99157',
    "Faculty level requirement": '#FAC863',
    "Major (towards primary degree) requirement": '#99C794',
    "Major (towards 2nd degree/major) requirement": '#5FB3B3',
    "Minor requirement": '#6699CC',
    "Unrestricted Elective": '#C594C5',
    "Specialisation Primary": '#AB7967',
    "Specialisation Elective": '#AB7967',
    default: '#d1d1d1'
  },
  tomorrow: {
    "University level requirement": '#FF4B82',
    "Faculty level requirement": '#FFC66D',
    "Major (towards primary degree) requirement": '#A6E22E',
    "Major (towards 2nd degree/major) requirement": '#66D9EF',
    "Minor requirement": '#A28DFF',
    "Unrestricted Elective": '#E69F66',
    "Specialisation Primary": '#F7F9F9',
    "Specialisation Elective": '#F7F9F9',
    default: '#d1d1d1'
  },
  twilight: {
    "University level requirement": '#F2777A',
    "Faculty level requirement": '#F4BF75',
    "Major (towards primary degree) requirement": '#99CC99',
    "Major (towards 2nd degree/major) requirement": '#66CCCC',
    "Minor requirement": '#CC99CC',
    "Unrestricted Elective": '#C0C0C0',
    "Specialisation Primary": '#A896C8',
    "Specialisation Elective": '#A896C8',
    default: '#d1d1d1'
  }
};

const getBackgroundColor = (palette: string, classification: string | undefined, isSelected: boolean, prereqNotSatisfied: boolean) => {
  const colors = colorPalettes[palette as keyof typeof colorPalettes];
  const color = colors[classification as keyof typeof colors] || colors.default;

  if (isSelected) {
    return prereqNotSatisfied ? '#f06969' : '#00c99e';
  }
  return color;
};

const Card: React.FC<CardProps> = ({
  id, name, semester, courseCredit, content, onClick, isSelected = false, grade, prereqTree,
  prereqNotSatisfied, colorScheme, classification
}) => {
  const backgroundColor = getBackgroundColor(colorScheme, classification, isSelected, prereqNotSatisfied);

  const cardClass = classnames('card', {
    'selected': isSelected,
    'prereq-not-satisfied': prereqNotSatisfied,
  });

  return (
    <div className='container'>
      <div className={cardClass} onClick={onClick} style={{ backgroundColor }}>
        {prereqNotSatisfied && <div className="overlay"></div>}
        <div className="card-title">{name}</div>
        <div className="card-text">{content}</div>
        <div className="card-text">{JSON.stringify(semester)}</div>
        <div className="card-mc-grade">
          {courseCredit + 'MC ' || ''} {grade ? 'Grade: ' + grade : ' '}
        </div>
        <div className="card-classification">{classification || ''}</div>
      </div>
    </div>
  );
};

export default Card;
