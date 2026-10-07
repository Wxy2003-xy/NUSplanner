import { useState } from 'react';
import './Like.css';

function Like() {
    const [count, setCount] = useState(0);
    const [count2, setCount2] = useState(0); 

    const handleClick = () => {
        setCount(count + 1); 
    }
    const handleClick2 = () => {
        setCount2(count2 + 1);
    }

    return (<>
        <button className="like-button" 
        style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '8px'
        }}onClick={handleClick}>
            Like {count} 
        </button>
        <button className="dislike-button" 
        style={{
            backgroundColor: '#992111',
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '8px'
        }}onClick={handleClick2}>
            Dislike {count2} 
        </button></>
    );
}

export default Like;
