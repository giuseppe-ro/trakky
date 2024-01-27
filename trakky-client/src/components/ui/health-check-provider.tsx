import React, { useEffect } from "react";
import { serverIsDown } from "@/infrastructure/healthcheck.ts";
import { FadeDown } from "@/components/animations/fade.tsx";
import { demoMode } from "@/constants.ts";

export function HealthCheckProvider() {
  const [serverDown, setServerDown] = React.useState(false);

  useEffect(() => {
    serverIsDown().then((isDown) => {
      setServerDown(isDown);
    });
  }, []);

  return (<>
    {serverDown && (
        <div className="sticky top-16 bg-gray-950 z-40">
          <FadeDown className="top-16 z-40">
            <div className="bg-yellow-600 w-full text-white text-xs md:text-base text-center">
              The server is down or not reachable.
            </div>
          </FadeDown>
        </div>
      )}
    {demoMode && (
      <div className="sticky top-16 bg-gray-950 z-40">
        <FadeDown className="top-16 z-40">
          <div className="bg-yellow-600 w-full text-white text-xs md:text-base text-center">
            Demo mode. Data cannot be saved.
          </div>
        </FadeDown>
      </div>
    )}
  </>);
}