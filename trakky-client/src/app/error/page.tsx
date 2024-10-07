import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ErrorMessage } from '@/infrastructure/remote/base';

export default function ErrorPage() {
  const error = useRouteError();

  const auth = useAuth();
  window.history.replaceState({}, document.title, window.location.pathname);

  let errorMessage = '';
  let notFound = false;

  if (auth && auth.error) {
    auth.removeUser().then(() => {
      errorMessage = ErrorMessage.FAILED_AUTHENTICATION;
    });
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
    </div>
  );
}
