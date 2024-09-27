import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useAuth } from 'react-oidc-context';
import { ErrorMessage } from '@/infrastructure/base-api';

export default function ErrorPage() {
  const error = useRouteError();

  const auth = useAuth();
  window.history.replaceState({}, document.title, window.location.pathname);
  const hardReload = async () => {
    if (!auth || (auth && auth.error)) {
      await auth.removeUser();
    }
    window.location.replace('/');
  };

  let errorMessage = '';
  let notFound = false;

  if (auth && auth.error) {
    errorMessage = ErrorMessage.FAILED_AUTHENTICATION;
  } else if (isRouteErrorResponse(error)) {
    errorMessage = error.data.message || error.statusText;
    if (errorMessage === 'Not Found') {
      notFound = true;
      errorMessage = ErrorMessage.NOT_FOUND;
    }
  }

  if (errorMessage === '') {
    errorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
  }

  return (
    <div className="flex flex-col justify-center align-middle m-6">
      <div id="error-page" className=" text-red-200">
        <h1 className="m-6">Oops!</h1>
        <div className="m-6">
          {!notFound && <p>Sorry, an unexpected error has occurred:</p>}

          <p>
            <i>{errorMessage}</i>
          </p>
        </div>
      </div>
      <div className="flex flex-row align-middle justify-center rounded ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => hardReload()}
              className="rounded bg-green-900 py-2 w-full flex justify-center items-center text-white hover:bg-green-800"
            >
              <ReloadIcon />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 text-white">
              Reload
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
