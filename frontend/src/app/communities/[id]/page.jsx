import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../../context/PostContext";
import { CommunityContext } from "../../../context/CommunityContext";
import { useParams, useSearchParams } from "react-router-dom";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Navbar } from "../../../components/layout/Navbar";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Tooltip } from "../../../components/ui/Tooltip";
import { LogOut } from "lucide-react";
import { NewPostButton } from "../../../components/feed/NewPostButton";
import { Tabs } from "../../../components/ui/Tabs";
import { PostCardSkeleton } from "../../../components/feed/PotCardSkeleton";
import { PostCard } from "../../../components/feed/PostCard";
import { CreatePostModal } from "../../../components/feed/CreatePostModal";
import { CommunityBanner } from "../../../components/community/CommunityBanner";
import { CommunityHeader } from "../../../components/community/CommunityHeader";
import "../Communities.css";
import { TaskItem } from "../../../components/community/TaskItem";
import { getCommunitySyllabus, updateCommunityTask } from "../../../lib/api";
import { JoinButton } from "../../../components/community/JoinButton";
import { TaskList } from "../../../components/community/TaskList";

export const CommunityPage = () => {
  const { communities, loading, fetchCommunities, toggleJoinCommunity } =
    useContext(CommunityContext);

  const {
    posts,
    loading: postsLoading,
    fetchCommunityPosts,
    handleCommentAdded,
    addPost,
  } = useContext(PostContext);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [syllabus, setSyllabus] = useState([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Feed";
  const [active, setActive] = useState(tabFromUrl);

  const tabs = ["Feed", "Syllabus", "Notes"];
  const community = communities.find((c) => c.id === Number(id));
  const communityJoined = community?.joined;

  const communityPosts = posts.filter(
    (post) => post.community.id === Number(id),
  );

  useEffect(() => {
    if (communities.length === 0 && !loading) {
      fetchCommunities();
    }
  }, [communities.length, loading]);

  useEffect(() => {
    if (active === "Feed") {
      fetchCommunityPosts(id);
    }

    if (active === "Syllabus" && syllabus.length === 0) {
      fetchCommunitySyllabus();
    }
  }, [active, id]);

  const fetchCommunitySyllabus = async () => {
    try {
      setLoadingSyllabus(true);
      const res = await getCommunitySyllabus(id);
      setSyllabus(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSyllabus(false);
    }
  };

  const handelTabChange = (tab) => {
    setActive(tab);
    setSearchParams({ tab });
  };

  if (loading || !community) {
    return (
      <PageContainer>
        <Navbar />
        <div style={{ padding: "16px" }}>Loading community...</div>
      </PageContainer>
    );
  }

  const toggleTask = async (taskId, nextCompleted) => {
    console.log("toggleTask", taskId, nextCompleted);

    setSyllabus((prev) => {
      console.log("before", prev);
      const updated = prev.map((task) =>
        task.taskId === taskId ? { ...task, completed: nextCompleted } : task,
      );
      console.log("after", updated);
      return updated;
    });

    try {
      await updateCommunityTask(Number(id), taskId, nextCompleted);
    } catch (e) {
      setSyllabus((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !nextCompleted } : task,
        ),
      );
    }
  };

  return (
    <PageContainer>
      <Navbar />

      <PageHeader className="community-page-header">
        <div className="first-row">
          {communityJoined && (
            <Tooltip label={"leave"}>
              <LogOut
                size={30}
                className="leave-button"
                onClick={() => toggleJoinCommunity(community.id)}
              />
            </Tooltip>
          )}
        </div>

        <div className="second-row">
          <CommunityBanner streak={community.streak} id={id} view="list" />
          <CommunityHeader
            name={community.name}
            description={community.description}
            members={community.memberCount}
            streak={community.streak}
            view="list"
          />

          <div className="join-button">
            {communityJoined ? (
              <NewPostButton onClick={() => setShowCreatePost(true)} />
            ) : (
              <JoinButton
                joined={false}
                onClick={() => toggleJoinCommunity(community.id)}
              />
            )}
          </div>
        </div>

        <div className="community-tabs">
          <Tabs tabs={tabs} active={active} onChange={handelTabChange} />
        </div>
      </PageHeader>

      <div className="main">
        {active === "Feed" &&
          (postsLoading.community
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : communityPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  onCommentAdded={() => handleCommentAdded(post.postId)}
                />
              )))}

        {active === "Syllabus" && syllabus.length > 0 && (
          <TaskList syllabus={syllabus} onToggle={toggleTask} />
        )}
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        joinedCommunities={[community]}
        defaultCommunityId={community.id}
        onPostCreated={addPost}
      />
    </PageContainer>
  );
};
