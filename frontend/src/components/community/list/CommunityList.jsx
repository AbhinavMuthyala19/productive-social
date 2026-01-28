import { CommunityCard } from "../cards/CommunityCard";
import { CommunityCardSkeleton } from "../cards/CommunityCardSkeleton";
import "./CommunityList.css";

export const CommunityList = ({
  communities,
  loading,
  view,
  onJoin,
  onLeave,
}) => {
  const containerClass = view === "grid" ? "community-grid" : "community-list";

  return (
    <div className={containerClass}>
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <CommunityCardSkeleton key={i} view={view} />
          ))
        : communities.map((c) => (
            <CommunityCard 
              key={c.id}
              id={c.id}
              name={c.name}
              description={c.description}
              memberCount={c.memberCount}
              joined={c.joined}
              streak={c.streak}
              view={view}
              onJoin={onJoin ? () => onJoin(c.id): undefined} 
              onLeave={onLeave ? () => onLeave(c) : undefined} 
            />
          ))}
    </div>
  );
};
