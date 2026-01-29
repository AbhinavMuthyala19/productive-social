import { Tabs } from "../ui/Tabs";


export const ProfileTabs = ({active, tabs, setActive, setSearchParams}) => {

  const handleTabChange = (tab) => {
    setActive(tab);
    setSearchParams({ tab }, {replace : true});
  };
  return (
    <div className="profile-tabs">
      <Tabs tabs={tabs} active={active} onChange={handleTabChange} />
    </div>
  );
};
