import React, { useState } from 'react';
import styles from './Button.module.css';

function Button() {
    const [count, setCount] = useState(0); // Using state for count

    const handleClick = () => {
        console.log("clicked");
    }

    const handleClick2 = (name: string) => {
        if (count < 3) {
            setCount(count + 1); // Update state correctly
            console.log(`${name} clicked me ${count + 1} times`);
        } else {
            console.log(`${name} stop`);
        }
    }

    const handleClick3 = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.textContent = "Ouch"; // Use currentTarget for type correctness
    }

    return (
        <div>
            {/* Button for basic click action */}
            <button className={styles.button} onClick={handleClick}>
                Basic Click
            </button>
            {/* Button to demonstrate counting clicks */}
            <button className={styles.button} onClick={() => handleClick2("User")}>
                Click me ({count})
            </button>
            {/* Button to change text on click */}
            <button className={styles.button} onClick={handleClick3}>
                Change Text
            </button>
        </div>
    );
}

export default Button;
