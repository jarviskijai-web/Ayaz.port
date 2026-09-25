import React, { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import MobileExperience from "./components/MobileExperience";
import { AppSkeleton } from "./components/LoadingSkeleton";

const useMobileViewport = () => {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= 768);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const syncViewport = () => setIsMobile(media.matches);
    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  return isMobile;
};

const App = () => {
  const isMobile = useMobileViewport();

  if (isMobile) {
    return (
      <LoadingProvider>
        <Suspense fallback={<AppSkeleton />}>
          <MobileExperience>
            <CharacterModel />
          </MobileExperience>
        </Suspense>
      </LoadingProvider>
    );
  }

  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<AppSkeleton />}>
          <MainContainer>
            <Suspense fallback={<AppSkeleton />}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
