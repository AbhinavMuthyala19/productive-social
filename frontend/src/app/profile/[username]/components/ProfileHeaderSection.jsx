import { PageHeader } from "../../../../components/layout/PageHeader";
import { ProfileHeader } from "../../../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../../../components/profile/ProfileTabs";
import "../../Profile.css";

export const ProfileHeaderSection = ({
  userProfile,
  activeTab,
  setActive,
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
        streak={userProfile.stats.streak}
        longestStreak={userProfile.stats.longestStreak}
        posts={userProfile.stats.posts}
        communities={userProfile.stats.communities}
      />

      <ProfileTabs
        active={activeTab}
        setActive={setActive}
        tabs={tabs}
        setSearchParams={setSearchParams}
      />
    </PageHeader>
  );
};
