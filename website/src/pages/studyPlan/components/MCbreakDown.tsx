import React, {useState} from "react";
import { CardType } from "../../../types/studyplan";
import { MCbreakDownProps, ShowBreakDownProps} from "../../../types/studyplan";
import './MCbreakDown.css'
  
  const MCbreakDown: React.FC<MCbreakDownProps> = ({ cards }) => {
    const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
    const cardArray:Array<Array<CardType>> = cards;
    const creditCounter:Array<number> = new Array(8).fill(0);
    const toggleBreakdownVisibility = () => {
        setIsBreakdownVisible(!isBreakdownVisible);
    };

    const getTotalMCCount = (cards: Array<Array<CardType>>): number => {
        return cards.slice(1).reduce((total, column) => {
            return total + column.reduce((colTotal, card) => colTotal + Number(card.courseCredit), 0);
        }, 0);
    };

    const iterateAllCards = (cards: Array<Array<CardType>>) => {
        cards.forEach((column, columnIndex) => {
          column.forEach(card => {
            console.log(`Column ${columnIndex}:`, card);
          });
        });
    };

    const updateClassification = (cards: Array<Array<CardType>>, counter:Array<number>) => {
        cards.forEach((column, columnIndex) => {
          column.forEach(card => {
            const credit = Number(card.courseCredit)
            switch (card.classification) {
                case 'University level requirement':
            creditCounter[0] += credit;
            break;
          case 'Faculty level requirement':
            creditCounter[1] += credit;
            break;
          case 'Major (towards primary degree) requirement':
            creditCounter[2] += credit;
            break;
          case 'Major (towards 2nd degree/major) requirement':
            creditCounter[3] += credit;
            break;
          case 'Minor requirement':
            creditCounter[4] += credit;
            break;
          case 'Specialisation Primary':
            creditCounter[5] += credit;
            break;
          case 'Specialisation Elective':
            creditCounter[6] += credit;
            break;
          case 'Unrestricted Elective':
            creditCounter[7] += credit;
            break;
            }
          });
        });
    };



    const ShowBreakDown: React.FC<ShowBreakDownProps> = ({ counter }) => {
        updateClassification(cards, creditCounter)
        const totalClassifiedCredits = creditCounter.reduce((acc, current) => acc + current, 0);
        const totalMC = getTotalMCCount(cardArray);
        const unclassifiedCredits = totalMC - totalClassifiedCredits;
        return (
            <>
            <ul>
                <li>University level requirement: {creditCounter[0]}</li>
                <li>Faculty level requirement: {creditCounter[1]}</li>
                <li>Major (towards primary degree) requirement: {creditCounter[2]}</li>
                <li>Major (towards 2nd degree/major) requirement: {creditCounter[3]}</li>
                <li>Minor requirement: {creditCounter[4]}</li>
                <li>Specialisation Primary: {creditCounter[5]}</li>
                <li>Specialisation Elective: {creditCounter[6]}</li>
                <li>Unrestricted Elective: {creditCounter[7]}</li>
                <li>Unclassified: {unclassifiedCredits}</li>
            </ul>
            </>
        );
    }
  
    return (
        <div className="counter-box">
             <div className="mc-count-container">
        <div>Total MC count: {getTotalMCCount(cards)}</div>
        <button
          onClick={toggleBreakdownVisibility}
          className={`toggle-button ${isBreakdownVisible ? 'collapse' : 'expand'}`}
        >{isBreakdownVisible ? 'Collapse' : 'Expand'}
        </button>
      </div>
            {isBreakdownVisible && (
            <div className="counter-box-breakdown">
                <div>
                    <ShowBreakDown counter={creditCounter}/>
                </div>
            </div>
             )}
        </div>
    );
  };
  
  export default MCbreakDown;