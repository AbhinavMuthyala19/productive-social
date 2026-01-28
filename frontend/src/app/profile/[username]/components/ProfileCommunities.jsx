import { CommunityList } from "../../../../components/community/list/CommunityList";

export const ProfileCommunities = ({
  communities,
  loading,
  isOwnProfile,
  onLeave,
  onJoin,
}) => {
  return (
    <CommunityList
      communities={communities}
      view={"list"}
      loading={loading}
      onLeave={isOwnProfile ? onLeave : undefined}
      onJoin={isOwnProfile ? onJoin : undefined}
    />
  );
};
