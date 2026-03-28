import { useSearchParams } from "react-router-dom";
import { Tabs } from "../ui/Tabs";

export const ProfileTabs = ({ tabs, setSearchParams }) => {
  const [searchParams] = useSearchParams();
  const active = searchParams.get("tab") || tabs[0];

  const handleTabChange = (tab) => {
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="profile-tabs">
      <Tabs tabs={tabs} active={active} onChange={handleTabChange} />
    </div>
  );
};
