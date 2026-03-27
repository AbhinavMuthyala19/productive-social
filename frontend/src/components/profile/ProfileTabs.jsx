import { useSearchParams } from "react-router-dom";
import { Tabs } from "../ui/Tabs";
import { useEffect } from "react";

export const ProfileTabs = ({ active, tabs, setActive, setSearchParams }) => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  useEffect(() => {
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActive(tabFromUrl);
    }
  }, [tabFromUrl, tabs, setActive]);

  // ✅ Sync State → URL
  const handleTabChange = (tab) => {
    setActive(tab);
    setSearchParams({ tab }, { replace: true });
  };
  
  return (
    <div className="profile-tabs">
      <Tabs tabs={tabs} active={active} onChange={handleTabChange} />
    </div>
  );
};
