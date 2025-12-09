import React, { useState, useContext } from 'react';
import { Button, Card, Form, Icon, Popup, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import UserContext from './context/userContext';
const axios = require('axios');


const Login = () => {
    const [coverEyes, setCoverEyes] = useState(false);
    const { setUserData } = useContext(UserContext);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errSignInMsg, setErrSignInMsg] = useState("");
    const [signInLoader, setSignInLoader] = useState(false);

    const onLogin = async () => {
        setSignInLoader(true);
        const url = window.apihost + "login";

        await axios.post(url, { userName, password })
            .then(response => {
                sessionStorage.setItem("auth-token", response.data.token);
                sessionStorage.setItem("userData", JSON.stringify(response.data));
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
                setUserData(response.data);
            })
            .catch(err => {
                setErrSignInMsg(err.response.data.message);
            })
            .finally(() => setSignInLoader(false));
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
            fontFamily: 'Arial, sans-serif',
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '100%',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 10,
                }}>
                    <Image
                        src="unimore-logo-landscape.png"
                        style={{
                            width: '80%',
                            maxWidth: '250px',
                            height: 'auto',
                            backgroundColor: 'white',
                        }}
                    />
                </div>
                <p style={{
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: '#555',
                    fontSize: '14px',
                }}>Please login to your account</p>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Email Input */}
                    <input
                        type="text"
                        placeholder="Username"
                        style={{
                            padding: '12px 15px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                        }}
                        value={userName}
                        onChange={e => { setUserName(e.target.value); setErrSignInMsg(""); }}
                        onFocus={(e) => (e.target.style.borderColor = '#6C63FF')}
                        onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                    />
                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        style={{
                            padding: '12px 15px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                        }}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setErrSignInMsg(""); }}
                        onFocus={(e) => (e.target.style.borderColor = '#6C63FF')}
                        onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                    />

                    {errSignInMsg !== "" &&
                        <h6 style={{
                            textAlign: 'center',
                            marginTop: 2,
                            marginBottom: 2,
                            color: 'red'
                        }}>{errSignInMsg}</h6>
                    }

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            padding: '14px',
                            background: 'linear-gradient(135deg, #6C63FF, #3D5AFE)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: signInLoader ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 15px rgba(108, 99, 255, 0.2)',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        disabled={signInLoader}
                        onClick={onLogin}
                        onMouseOver={(e) => {
                            if (!signInLoader) {
                                e.target.style.background = 'linear-gradient(135deg, #5A4EE3, #2D44D5)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!signInLoader) {
                                e.target.style.background = 'linear-gradient(135deg, #6C63FF, #3D5AFE)';
                            }
                        }}
                    >
                        {signInLoader ? (
                            <div
                                style={{
                                    border: '4px solid #f3f3f3',
                                    borderRadius: '50%',
                                    borderTop: '4px solid #fff',
                                    width: '20px',
                                    height: '20px',
                                    animation: 'spin 1s linear infinite',
                                }}
                            />
                        ) : (
                            'Log In'
                        )}

                        {/* Spinner animation style */}
                        <style>
                            {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
                        </style>
                    </button>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 20
                    }}>
                        <Popup
                            content='Contact admin to change your password.'
                            on='click'
                            pinned
                            trigger={<a href="#"><b>Forgot Password?</b></a>}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
