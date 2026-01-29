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
      onRequestLeaveCommunity={isOwnProfile ? onLeave : undefined}
      onJoinCommunity={isOwnProfile ? onJoin : undefined}
    />
  );
};
