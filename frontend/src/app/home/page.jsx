import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { PostCard } from "../../components/feed/PostCard"
import { NewPostButton } from "../../components/feed/NewPostButton"
import { PageHeader } from "../../components/layout/PageHeader"
import "../../App.css"

export const Home = () => {

    return (
        <PageContainer>
            <Navbar />
            <PageHeader title="Global Feed" description="Join challenge-based communities and stay accountable" 
            ><NewPostButton/></PageHeader>
            <div className="main">
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