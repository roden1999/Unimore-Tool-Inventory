import React, { useState, useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment';

//Components
import Projects from './projects';
import ConsumablesForms from './consumableForms';


const customSelectStyle = {
    control: base => ({
        ...base,
        height: 40,
        minHeight: 40,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        // backgroundColor: '#383f48',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
        zIndex: 1000
    }),
    singleValue: base => ({
        ...base,
        // color: "#fff"
    }),
    input: base => ({
        ...base,
        // color: "#fff"
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

const Forms = () => {

    const panes = [
        { menuItem: 'Tool Forms', render: () => <Tab.Pane><Projects/></Tab.Pane> },
        { menuItem: 'Consumable Forms', render: () => <Tab.Pane><ConsumablesForms/></Tab.Pane> },
    ]

    return (
        <div>
            <Tab panes={panes}/>
        </div>
    );
}

export default Forms;
