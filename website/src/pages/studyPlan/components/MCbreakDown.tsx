import React, { useMemo, useState } from 'react';
import { MCbreakDownProps } from '../../../types/studyplan';
import './MCbreakDown.css';

const classifications = [
  'University level requirement',
  'Faculty level requirement',
  'Major (towards primary degree) requirement',
  'Major (towards 2nd degree/major) requirement',
  'Minor requirement',
  'Specialisation Primary',
  'Specialisation Elective',
  'Unrestricted Elective',
] as const;

const MCbreakDown: React.FC<MCbreakDownProps> = ({ cards }) => {
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
  const { totalCredits, classifiedCredits, unclassifiedCredits } = useMemo(() => {
    const counts = Object.fromEntries(classifications.map((name) => [name, 0])) as Record<(typeof classifications)[number], number>;
    const plannedCards = cards.slice(1).flat();

    plannedCards.forEach((card) => {
      if (card.classification && card.classification in counts) {
        counts[card.classification as keyof typeof counts] += Number(card.courseCredit);
      }
    });

    const total = plannedCards.reduce((sum, card) => sum + Number(card.courseCredit), 0);
    const classified = Object.values(counts).reduce((sum, credits) => sum + credits, 0);
    return {
      totalCredits: total,
      classifiedCredits: counts,
      unclassifiedCredits: total - classified,
    };
  }, [cards]);

  return (
    <div className="counter-box">
      <div className="mc-count-container">
        <div>Total units: {totalCredits}</div>
        <button
          type="button"
          onClick={() => setIsBreakdownVisible((visible) => !visible)}
          className={`toggle-button ${isBreakdownVisible ? 'collapse' : 'expand'}`}
          aria-expanded={isBreakdownVisible}
        >
          {isBreakdownVisible ? 'Hide breakdown' : 'View breakdown'}
        </button>
      </div>
      {isBreakdownVisible && (
        <div className="counter-box-breakdown">
          <ul>
            {classifications.map((classification) => (
              <li key={classification}>{classification}: {classifiedCredits[classification]}</li>
            ))}
            <li>Unclassified: {unclassifiedCredits}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MCbreakDown;
