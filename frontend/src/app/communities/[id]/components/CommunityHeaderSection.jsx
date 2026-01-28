import { LogOut } from "lucide-react";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { Tooltip } from "../../../../components/ui/Tooltip";
import { CommunityBanner } from "../../../../components/community/header/CommunityBanner";
import { CommunityHeader } from "../../../../components/community/header/CommunityHeader";
import { JoinButton } from "../../../../components/community/actions/JoinButton";
import { NewPostButton } from "../../../../components/feed/NewPostButton";
import { Tabs } from "../../../../components/ui/Tabs";

export const CommunityHeaderSection = ({
  community,
  communityJoined,
  onLeave,
  onNewPost,
  onJoin,
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <PageHeader className="community-page-header">
      <div className="first-row">
        {communityJoined && (
          <Tooltip label={"leave"}>
            <LogOut
              size={30}
              className="leave-icon"
              onClick={onLeave}
            />
          </Tooltip>
        )}
      </div>

      <div className="second-row">
        <CommunityBanner streak={community.streak} id={community.id} view="list" />
        <CommunityHeader
          name={community.name}
          description={community.description}
          members={community.memberCount}
          streak={community.streak}
          view="list"
        />

        <div className="join-button">
          {communityJoined ? (
            <NewPostButton onClick={onNewPost} />
          ) : (
            <JoinButton
              joined={false}
              onClick={onJoin}
            />
          )}
        </div>
      </div>

      <div className="community-tabs">
        <Tabs tabs={tabs} active={activeTab} onChange={onTabChange} />
      </div>
    </PageHeader>
  );
};
