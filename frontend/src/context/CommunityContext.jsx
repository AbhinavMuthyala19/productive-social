import { createContext, useEffect, useState } from "react";
import { getCommunities } from "../lib/api";


export const CommunityContext = createContext()

export const CommunityProvider = ({ children }) => {

    const [communities, setCommunities] = useState([])

    useEffect(() => {
        fetchCommunities()
    }, [])

    const fetchCommunities = async () => {
        try {
            const res = await getCommunities()
            const sorted = [...res.data].sort((a, b) => {
                if (a.joined !== b.joined) {
                    return Number(b.joined) - Number(a.joined);
                }
                return b.memberCount - a.memberCount;
            });
            setCommunities(sorted)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <CommunityContext.Provider value={{ communities, fetchCommunities }}>
            {children}
        </CommunityContext.Provider>
    );
}