import { PageContainer } from "../../components/layout/PageContainer"
import { Navbar } from "../../components/layout/Navbar"
import { CommunityCard } from "../../components/community/CommunityCard"
import { useContext, useState } from "react"
import { CommunityContext } from "../../context/CommunityContext"
import { PageHeader } from "../../components/layout/PageHeader"
import { Grid, List } from "lucide-react"
import "./Communities.css"


export const Communities = () => {
    const { communities } = useContext(CommunityContext);
    const [view, setView] = useState("grid")
    return (
        <PageContainer>
            <Navbar />
            <PageHeader title={"Communities"} description={"Join challenge based communities and stay accountable"} />
            <div className="main">
                <div className="card-view">
                    <Grid size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => setView("grid")}
                        color={view === "grid" ? "#2563eb" : "#111113"}
                    />
                    <List size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => setView("list")}
                        color={view === "list" ? "#2563eb" : "#111113"}
                    />
                </div>
                <div className="community-grid">
                    {communities.map(community => (
                        <CommunityCard key={community.id} data={community} view={view} />
                    ))

                    }
                </div>
            </div>
        </PageContainer >
    )
}