//profileHubContext

import React, { createContext, useReducer, useContext, useState, useEffect } from 'react';


const profileHubContext = createContext();

export const useprofileHubContext = () => {
    return useContext(profileHubContext);
    }


export const profileHubProvider = ({ children }) => {
    
    const [profileHubLoaded, setprofileHubLoaded] = useState(false);
    const [perpetualOrganizations, setPerpetualOrganizations] = useState([]);

    useEffect(() => {
        console.log("profileHubed load", profileHubLoaded)
        if (profileHubLoaded) {
            fetchPOs().then((data) => {
                console.log(data);
                setPerpetualOrganizations(data);
            });
            
        }
    }
    , [profileHubLoaded]);



    const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

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
              logoHash
              aboutInfo{
                description
                links{
                    name
                    url
                }
              }
              }
            }`;

        const data = await querySubgraph(query);
        return data?.perpetualOrganizations;
    }



    return (
        <profileHubContext.Provider value={{perpetualOrganizations, setprofileHubLoaded}}>
        {children}
        </profileHubContext.Provider>
    );
}




