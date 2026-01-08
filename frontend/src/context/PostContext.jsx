import { createContext, useContext, useEffect, useState } from "react";
import { getGlobalPosts, likePosts, unlikePosts } from "../lib/api";
import { AuthContext } from "./AuthContext";


export const PostContext = createContext()

export const PostProvider = ({ children }) => {

    const [globalPosts, setGlobalPosts] = useState([])
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setGlobalPosts([]);
            return;
        }
        fetchGlobalPosts()
    }, [user]);


    const fetchGlobalPosts = async () => {
        try {
            setLoading(true)
            const response = await getGlobalPosts()
            console.log(response.data)
            setGlobalPosts(response.data)
        } catch (error) {
            console.error(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const likePost = async (postId) => {
        try {
            setGlobalPosts(prev =>
                prev.map(post =>
                    post.postId === postId
                        ? {
                            ...post,
                            likedByCurrentUser: true,
                            likesCount: post.likesCount + 1
                        }
                        : post
                )
            )
            await likePosts(postId)
        } catch (error) {
            console.log(error)
            fetchGlobalPosts()
        }
    }

    const unlikePost = async (postId) => {
        try {

            setGlobalPosts(prev =>
                prev.map(post =>
                    post.postId === postId
                        ? {
                            ...post,
                            likedByCurrentUser: false,
                            likesCount: post.likesCount - 1
                        }
                        : post
                )
            )
            await unlikePosts(postId)
        } catch (error) {
            console.log(error)
            fetchGlobalPosts()
        }
    }



    return <PostContext.Provider value={{ globalPosts, loading, error, likePost, unlikePost, fetchGlobalPosts }}>
        {children}
    </PostContext.Provider>
}