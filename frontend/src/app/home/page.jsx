import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { PostCard } from "../../components/feed/PostCard"
import "./home.css"
import { NewPostButton } from "../../components/feed/NewPostButton"

export const Home = () => {

    return (
        <PageContainer>
            <Navbar />
            <div className="global-feed">
                <div className="global-header">
                    <div className="title">
                        <h1>Global Feed</h1>
                        <p>Posts from your communities</p>
                    </div>
                    <NewPostButton />
                </div>
                <PostCard
                    post={{
                        comments: [
                            { name: "Sai Teja", username: "@saiteja", comment: "Nice..." },
                            { name: "Abhinav", username: "@abhinav", comment: "Pakakeli aduko" },
                            { name: "Vinay", username: "@vinay", comment: "Ahaaa...." },
                            { name: "Anil", username: "@anil", comment: "Super ra bittu" },
                            { name: "Prasanna", username: "@prasanna", comment: "❤️🔥" }
                        ]
                    }}
                />
                <PostCard
                    post={{
                        comments: [
                            { name: "Sai Teja", username: "@saiteja", comment: "Nice..." },
                            { name: "Abhinav", username: "@abhinav", comment: "Pakakeli aduko" },
                            { name: "Vinay", username: "@vinay", comment: "Ahaaa...." },
                            { name: "Anil", username: "@anil", comment: "Super ra bittu" },
                            { name: "Prasanna", username: "@prasanna", comment: "❤️🔥" }
                        ]
                    }}
                />
                <PostCard
                    post={{
                        comments: [
                            { name: "Sai Teja", username: "@saiteja", comment: "Nice..." },
                            { name: "Abhinav", username: "@abhinav", comment: "Pakakeli aduko" },
                            { name: "Vinay", username: "@vinay", comment: "Ahaaa...." },
                            { name: "Anil", username: "@anil", comment: "Super ra bittu" },
                            { name: "Prasanna", username: "@prasanna", comment: "❤️🔥" }
                        ]
                    }}
                />
                <PostCard
                    post={{
                        comments: [
                            { name: "Sai Teja", username: "@saiteja", comment: "Nice..." },
                            { name: "Abhinav", username: "@abhinav", comment: "Pakakeli aduko" },
                            { name: "Vinay", username: "@vinay", comment: "Ahaaa...." },
                            { name: "Anil", username: "@anil", comment: "Super ra bittu" },
                            { name: "Prasanna", username: "@prasanna", comment: "❤️🔥" }
                        ]
                    }}
                />

                
            </div>
        </PageContainer>
    )
}