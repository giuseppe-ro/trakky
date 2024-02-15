import { memo, useEffect, useState } from 'react';
import serverIsDown from '@/infrastructure/healthcheck';
import { demoMode } from '@/constants';
import { FadeDown } from '@/components/ui/animations/fade';

export const HealthCheckProvider = memo(() => {
  const [serverDown, setServerDown] = useState(false);

  const checkServer = async () => {
    try {
      const isDown = await serverIsDown();
      setServerDown(isDown);
    } catch (error) {
      setServerDown(true);
    }
  };

  useEffect(() => {
    checkServer().then(() => {});
  }, []);

  return (
    <>
      {!demoMode && serverDown && (
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
    </>
  );
});

HealthCheckProvider.displayName = 'HealthCheckProvider';

export default HealthCheckProvider;
