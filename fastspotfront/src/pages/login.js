import React from 'react';

const Login = (props) => {
    const { baseURL } = props;
    const handleLoginClick = () => {
        const newUrl = `${baseURL}/authorization`;
        console.log("login pitäisi tapahtua");
        console.log(newUrl);
        
        window.location.href = newUrl;
    };


    // REDIRECTING STRAIGHT TO SPOTIFY AUTHORIZATION PAGE TO LOGIN AND AUTHORIZE
    return (
        <div className="login-container head-container">
            <h2 className="login-title title">AUTHORIZATION</h2>
            <h3 className="login-subtitle subtitle">LOGIN TO YOUR <span className="spotify">SPOTIFY</span> CREDENTIALS</h3>
            <button onClick={handleLoginClick} className='login-authorize'>Authorize</button>
        </div>
    );
};

export default Login;