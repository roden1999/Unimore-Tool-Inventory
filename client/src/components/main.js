import React, { useState, useEffect, useContext } from 'react';
import { Menu, Segment, Icon, Dropdown, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

// Components
import MachineSpareParts from './machineSpareParts';
import Tools from './tools';
import Consumables from './consumables';
import Records from './records';
import Employees from './employees';
import Projects from './projects';
import Forms from './forms';
import Users from './user';
import UserContext from './context/userContext';

const Main = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [page, setPage] = useState("MENU");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedPage = sessionStorage.getItem('page');
    if (savedPage) setPage(savedPage);

    const user = JSON.parse(sessionStorage.getItem('user'));
    setRole(user?.role || "");
    setName(user?.Name || "");
  }, []);

  useEffect(() => {
    sessionStorage.setItem('page', page);
  }, [page]);

  const handlePage = (value) => setPage(value);

  const logOut = () => {
    setUserData({ token: undefined, user: undefined });
    sessionStorage.clear();
  };

  return (
    <div style={styles.container}>
      
      {/* NAVIGATION BAR */}
      <Menu stackable inverted fixed="top" style={styles.menu}>
        <Menu.Item>
          <img src="unimore-logo.png" alt="logo" style={styles.logo} /> 
          <span style={{ marginLeft: 8 }}>Unimore Trading</span>
        </Menu.Item>

        <Menu.Menu position="right">
          {page !== "MENU" && (
            <Menu.Item onClick={() => handlePage("MENU")}>
              <Icon name='th large' /> Menu
            </Menu.Item>
          )}

          <Dropdown item text={name}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logOut}>
                <Icon name='log out' /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>

      {/* MAIN PAGE CONTAINER */}
      <div style={styles.pageContent}>
        <Segment style={styles.segment}>
          
          {/* PAGE ROUTING */}
          {page === "SPARE PARTS" && role !== "Tool Keeper" && <MachineSpareParts />}
          {page === "TOOLS" && <Tools />}
          {page === "CONSUMABLES" && <Consumables />}
          {page === "RECORDS" && <Records />}
          {page === "EMPLOYEES" && <Employees />}
          {page === "FORMS" && <Forms />}
          {page === "MANAGE_USER" && role === "Administrator" && <Users />}

          {/* MENU DASHBOARD */}
          {page === "MENU" && (
            <Card.Group
              itemsPerRow={4}       // desktop
              stackable             // stack on tablet/mobile
              doubling              // double rows on smaller screens
              centered
              style={{ marginTop: 20, justifyContent: 'center' }}
            >
              {role !== "Tool Keeper" && (
                <Card
                  link
                  header={<h3 style={styles.cardTitle}>MACHINE SPARE PARTS</h3>}
                  style={{ ...styles.menuCard, backgroundImage: `url("spareparts.png")` }}
                  onClick={() => handlePage("SPARE PARTS")}
                />
              )}

              <Card
                link
                header={<h3 style={styles.cardTitle}>TOOLS</h3>}
                style={{ ...styles.menuCard, backgroundImage: `url("tools.png")` }}
                onClick={() => handlePage("TOOLS")}
              />

              <Card
                link
                header={<h3 style={styles.cardTitle}>CONSUMABLES</h3>}
                style={{ ...styles.menuCard, backgroundImage: `url("consumables.jpg")` }}
                onClick={() => handlePage("CONSUMABLES")}
              />

              <Card
                link
                header={<h3 style={{ ...styles.cardTitle, backgroundColor: 'white' }}>BORROWED / RETURNED</h3>}
                style={{ ...styles.menuCard, backgroundImage: `url("records.jpeg")` }}
                onClick={() => handlePage("RECORDS")}
              />

              <Card
                link
                header={<h3 style={styles.cardTitle}>PROJECTS</h3>}
                style={{ ...styles.menuCard, backgroundImage: `url("projects.jpg")` }}
                onClick={() => handlePage("FORMS")}
              />

              <Card
                link
                header={<h3 style={styles.cardTitle}>EMPLOYEES</h3>}
                style={{ ...styles.menuCard, backgroundImage: `url("employees.png")` }}
                onClick={() => handlePage("EMPLOYEES")}
              />

              {role === "Administrator" && (
                <Card
                  link
                  header={<h3 style={styles.cardTitle}>USERS</h3>}
                  style={{ ...styles.menuCard, backgroundImage: `url("users.png")` }}
                  onClick={() => handlePage("MANAGE_USER")}
                />
              )}
            </Card.Group>
          )}

        </Segment>
      </div>
    </div>
  );
};

export default Main;

// ---------------------- STYLES ---------------------- //
const styles = {
  container: {
    width: '100%',
    overflowX: 'hidden'
  },

  menu: {
    padding: '0.7rem 1rem'
  },

  logo: {
    width: 35,
    height: 'auto'
  },

  pageContent: {
    padding: '80px 10px 20px 10px'   // spacing for fixed navbar
  },

  segment: {
    minHeight: '90vh',
    overflowY: 'auto'
  },

  menuCard: {
    minHeight: "20vh",
    maxWidth: 250,
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: "1rem"
  },

  cardTitle: {
    fontSize: "1.2rem",
    padding: "5px 10px",
    background: "rgba(255,255,255,0.8)"
  }
};
