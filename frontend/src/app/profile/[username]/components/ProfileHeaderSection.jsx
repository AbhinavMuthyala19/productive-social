import { PageHeader } from "../../../../components/layout/PageHeader";
import { ProfileHeader } from "../../../../components/profile/ProfileHeader";
import { ProfileHeaderSkeleton } from "../../../../components/profile/ProfileHeaderSkeleton";
import { ProfileTabs } from "../../../../components/profile/ProfileTabs";
import "../../Profile.css";

export const ProfileHeaderSection = ({
  loading,
  userProfile,
  tabs,
  setSearchParams,
}) => {

  return (
    <PageHeader className={"profile-page-header"}>
      {loading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <>
          <ProfileHeader
            name={userProfile?.name}
            username={userProfile?.username}
            bio={userProfile?.bio}
            profilePicture={userProfile?.profilePicture}
            streak={userProfile?.stats.streak}
            longestStreak={userProfile?.stats.longestStreak}
            posts={userProfile?.stats.posts}
            communities={userProfile?.stats.communities}
          />

          <ProfileTabs tabs={tabs} setSearchParams={setSearchParams} />
        </>
      )}
    </PageHeader>
  );
};
