import { createContext, useEffect, useState } from "react";
import { getCommunities } from "../lib/api";


export const CommunityContext = createContext()

export const CommunityProvider = ({children}) =>{

    const [communities, setCommunities] = useState([])

    useEffect(() => {
        fetchCommunities()
    }, [])

    const fetchCommunities = async () =>{
        try {
            const res = await getCommunities()
            setCommunities(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
            <CommunityContext.Provider value={{communities, fetchCommunities}}>
                {children}
            </CommunityContext.Provider>
        );
}