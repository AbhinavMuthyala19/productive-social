import { PageContainer } from "../../../components/layout/PageContainer";
import { Navbar } from "../../../components/layout/Navbar";
import "../Profile.css";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  downloadNotes,
  getUserCommunities,
  getUserCommunitiesByUserName,
  getUserNotes,
  getUserNotesByUserName,
  getUserProfile,
  getUserProfileByUserName,
} from "../../../lib/api";
import { PostContext } from "../../../context/PostContext";
import { useParams, useSearchParams } from "react-router-dom";
import { useLeaveCommunity } from "../../../hooks/useLeaveCommunity";
import { CommunityContext } from "../../../context/CommunityContext";
import { CommunityLeaveModal } from "../../../components/community/actions/CommunityLeaveModal";
import { NotesUploadModal } from "../../../components/notes/NotesUploadModal";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileHeaderSection } from "./components/ProfileHeaderSection";
import { ProfileCommunities } from "./components/ProfileCommunities";
import { Feed } from "../../../components/feed/Feed";
import { SearchBar } from "../../../components/ui/SearchBar";
import { Button } from "../../../components/ui/Button";
import { Plus } from "lucide-react";
import { NotesCard } from "../../../components/notes/NotesCard";
import { downloadFile } from "../../../lib/downloadFile";
import { ProfileHeaderSkeleton } from "../../../components/profile/ProfileHeaderSkeleton";

export const Profile = () => {
  const { toggleJoinCommunity } = useContext(CommunityContext);
  const {
    posts,
    fetchUserPosts,
    loading: postsLoading,
    handleCommentAdded,
    toggleLike,
    hasMore,
    loadMoreUser,
  } = useContext(PostContext);
  const { user: loggedInUser } = useContext(AuthContext);
  const leaveModal = useLeaveCommunity(toggleJoinCommunity);
  const [userProfile, setUserProfile] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [notesSearch, setNotesSearch] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showNotesUploadModal, setShowNotesUploadModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabs = ["Feed", "Notes", "Communities"];
  const tabFromUrl = searchParams.get("tab");
  const active = tabs.includes(tabFromUrl) ? tabFromUrl : "Feed";
  const { username } = useParams();

  const profilePosts = useMemo(
    () => posts.filter((post) => post.user.username === userProfile?.username),
    [posts, userProfile?.username],
  );

  const isOwnProfile = !username || loggedInUser?.username === username;

  const fetchUserProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const res = username
        ? await getUserProfileByUserName(username)
        : await getUserProfile();

      setUserProfile(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProfileLoading(false);
    }
  }, [username]);

  const fetchUserCommunities = useCallback(async () => {
    try {
      setCommunitiesLoading(true);
      const res = username
        ? await getUserCommunitiesByUserName(username)
        : await getUserCommunities();

      setUserCommunities(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCommunitiesLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserProfile();
  }, [username, fetchUserProfile]);

  const fetchUserNotes = useCallback(async () => {
    try {
      setNotesLoading(true);
      const res = username
        ? await getUserNotesByUserName(username)
        : await getUserNotes();

      setUserNotes(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setNotesLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (!userProfile?.id) return;

    fetchUserPosts(username);
  }, [userProfile?.id, username]);

  useEffect(() => {
    if (!userProfile?.id) return;

    if (active === "Communities" && userCommunities.length === 0) {
      fetchUserCommunities();
    } else if (active === "Notes" && userNotes.length === 0) {
      fetchUserNotes();
    }
  }, [active, userProfile?.id, userCommunities.length, userNotes.length]);

  const handleLeaveClick = (community) => {
    leaveModal.open(community);
  };

  const confirmLeave = async () => {
    await leaveModal.confirm();

    setUserCommunities((prev) =>
      prev.filter((c) => c.id !== leaveModal.community.id),
    );
  };

  const filteredNotes = useMemo(() => {
    if (!notesSearch.trim()) return userNotes;

    return userNotes.filter((note) =>
      note.originalFileName?.toLowerCase().includes(notesSearch.toLowerCase()),
    );
  }, [userNotes, notesSearch]);

  const handleNotesDownload = async (notesId) => {
    const res = await downloadNotes(notesId);
    downloadFile(res.data, "notes.pdf");
  };

  return (
    <PageContainer>
      <Navbar />
      <ProfileHeaderSection
        loading={profileLoading}
        userProfile={userProfile}
        tabs={tabs}
        setSearchParams={setSearchParams}
      />
      <div className="main">
        {active === "Feed" && (
          <Feed
            posts={profilePosts}
            loading={postsLoading.user}
            hasMore={hasMore.user}
            loadMore={() => loadMoreUser(username)}
            onCommentAdded={handleCommentAdded}
            onToggleLike={toggleLike}
            displayCommunityBadge
            userNameClickable={false}
          />
        )}

        {active === "Notes" && (
          <>
            <div className="profile-notes-search-upload-bar">
              <SearchBar
                value={notesSearch}
                onChange={(e) => setNotesSearch(e.target.value)}
                placeholder="Search notes..."
              />

              <Button
                onClick={() => setShowNotesUploadModal(true)}
                className="upload-notes-button"
              >
                <Plus size={14} />
                Upload
              </Button>
            </div>

            {filteredNotes.length > 0 ? (
              filteredNotes.map((file) => (
                <NotesCard
                  key={file.id}
                  file={file}
                  onDownload={handleNotesDownload}
                />
              ))
            ) : (
              <p>No notes found</p>
            )}
          </>
        )}

        {active === "Communities" && (
          <ProfileCommunities
            communities={userCommunities}
            loading={communitiesLoading}
            isOwnProfile={isOwnProfile}
            onLeave={handleLeaveClick}
            onJoin={toggleJoinCommunity}
          />
        )}
      </div>
      {/* ✅ Leave modal */}
      <CommunityLeaveModal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        onConfirm={confirmLeave}
      />

      <NotesUploadModal
        isOpen={showNotesUploadModal}
        onClose={() => setShowNotesUploadModal(false)}
        onUploadSuccess={(newNote) => {
          setUserNotes((prev) => [newNote, ...prev]); // prepend new note
        }}
      />
    </PageContainer>
  );
};
