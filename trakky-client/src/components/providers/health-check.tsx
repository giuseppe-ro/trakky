import { memo } from 'react';
import serverIsDown from '@/infrastructure/healthcheck';
import { demoMode } from '@/constants';
import { FadeDown } from '@/components/ui/animations/fade';
import { useQuery } from 'react-query';

export const HealthCheckProvider = memo(() => {
  const { data: isDown, isError } = useQuery(
    'serverStatus',
    async ({ signal }) => {
      return serverIsDown(signal);
    }
  );

  if ((!demoMode && !isDown) || isError) {
    return (
      <div className="sticky top-16 bg-gray-950 z-40">
        <FadeDown className="top-16 z-40">
          <div className="bg-yellow-600 w-full text-white text-xs md:text-base text-center">
            The server is down or not reachable.
          </div>
        </FadeDown>
      </div>
    );
  }

  if (demoMode) {
    return (
      <div className="sticky top-16 bg-gray-950 z-40">
        <FadeDown className="top-16 z-40">
          <div className="bg-yellow-600 w-full text-white text-xs md:text-base text-center">
            Demo mode. Data cannot be saved.
          </div>
        </FadeDown>
      </div>
    );
  }

  return null;
});

HealthCheckProvider.displayName = 'HealthCheckProvider';

export default HealthCheckProvider;
