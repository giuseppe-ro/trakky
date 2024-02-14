import { resultToast } from '@/components/ui/use-toast';

export function errorMessage(
  setIsError: (value: boolean) => void,
  message?: string
) {
  setIsError(true);

  return resultToast({
    isError: true,
    message: message ?? 'Unknown error',
  });
}

errorMessage.defaultProps = {
  message: null,
};

export default errorMessage;
