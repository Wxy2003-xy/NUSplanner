import React from 'react';
import PropTypes from 'prop-types';

interface UserGreetingProps {
    isLoggedIn: boolean;
    username?: string;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ isLoggedIn, username = 'Guest'}) => {
    const welcomeMessage = <h2 className='welcome-msg'>Welcome, {username}!</h2>;
    const loginPrompt = <h2 className='login-prompt'>Please log in to continue</h2>;
    if (isLoggedIn) {
        return welcomeMessage;
    }

    return loginPrompt;
};

UserGreeting.defaultProps = {
    isLoggedIn: false,
    username: "Guest",
}

UserGreeting.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
};

export default UserGreeting;
