import React, { useState, useEffect } from 'react';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

//Components
import Login from './components/login';
import UserContext from './components/context/userContext';
import axios from 'axios';

// Components
import Main from './components/main';


function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoader(false), 2000)
  }, [loader, setLoader]);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) setUserData(JSON.parse(data));
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      let token = sessionStorage.getItem("auth-token");
      if (token === null) {
        sessionStorage.setItem("auth-token", "");
        token = "";
      }
      const response = await axios.post(window.apihost + "login/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (response.data) {
        console.log(response.data);
        const user = await axios.get(window.apihost + "login/tokenIsValid",
          {
            headers: { "x-auth-token": token },
          });
        setUserData({
          token,
          user: response.data,
        });
      }
    };

    checkLogin();
  }, []);
  return (
    <div className="App" style={{ height: '100%', width: '100%', position: 'relative', backgroundColor: '#3D3D3D' }}>
      {loader === true &&
        <div style={{
          height: '100vh',
          width: '100%',
          fontFamily: `'Montserrat', sans-serif`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          background: '#F3F1F1',
        }}>
          <Loader
            type="Watch"
            color="#00BFFF"
            height={100}
            width={100}//3 secs
          />
        </div>
      }
      <UserContext.Provider value={{ userData, setUserData }}>
        {loader === false && userData.user &&
          <Main />
        }

        {loader === false && !userData.user &&
          <Login />
        }
      </UserContext.Provider>
    </div>
  );
}

export default App;
