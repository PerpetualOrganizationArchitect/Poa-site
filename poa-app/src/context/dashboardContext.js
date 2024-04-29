//DashboardContext

import React, { createContext, useReducer, useContext, useState, useEffect } from 'react';


const DashboardContext = createContext();

export const useDashboardContext = () => {
    return useContext(DashboardContext);
    }


export const DashboardProvider = ({ children }) => {
    
    const [dashboardLoaded, setDashboardLoaded] = useState(false);
    const [perpetualOrganizations, setPerpetualOrganizations] = useState([]);

    useEffect(() => {
        if (!dashboardLoaded) {
            fetchPOs().then((data) => {
                console.log(data);
                setPerpetualOrganizations(data);
            });
            
        }
    }
    , [dashboardLoaded]);



    const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/hudsonhrh/poa';

    async function querySubgraph(query) {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Error fetching data:', data.errors);
            return null;
        }

        return data.data;
    }

    async function fetchPOs() {

        const query = `
        {
        perpetualOrganizations {
              id
              logoURL
              }
            }`;

        const data = await querySubgraph(query);
        return data?.perpetualOrganizations;
    }



    return (
        <DashboardContext.Provider value={{perpetualOrganizations, setDashboardLoaded}}>
        {children}
        </DashboardContext.Provider>
    );
}




