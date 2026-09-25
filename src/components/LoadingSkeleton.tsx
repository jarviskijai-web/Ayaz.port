import "./styles/LoadingSkeleton.css";

export const AppSkeleton = () => (
  <div className="app-skeleton" aria-label="Loading portfolio" role="status">
    <div className="skeleton-nav" />
    <div className="skeleton-hero">
      <span />
      <strong />
      <strong />
      <i />
    </div>
    <div className="skeleton-blocks"><span /><span /><span /></div>
  </div>
);

export const MascotSkeleton = () => (
  <div className="mascot-skeleton" aria-label="Loading mascot" role="status">
    <span />
    <i />
  </div>
);
