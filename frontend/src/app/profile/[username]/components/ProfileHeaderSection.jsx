import { PageHeader } from "../../../../components/layout/PageHeader";
import { ProfileHeader } from "../../../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../../../components/profile/ProfileTabs";
import "../../Profile.css";

export const ProfileHeaderSection = ({
  userProfile,
  tabs,
  setSearchParams,
}) => {
  if (!userProfile) return null;
  return (
    <PageHeader className={"profile-page-header"}>
      <ProfileHeader
        name={userProfile.name}
        username={userProfile.username}
        bio={userProfile.bio}
        profilePicture={userProfile.profilePicture}
        streak={userProfile.stats.streak}
        longestStreak={userProfile.stats.longestStreak}
        posts={userProfile.stats.posts}
        communities={userProfile.stats.communities}
      />

      <ProfileTabs
        tabs={tabs}
        setSearchParams={setSearchParams}
      />
    </PageHeader>
  );
};
