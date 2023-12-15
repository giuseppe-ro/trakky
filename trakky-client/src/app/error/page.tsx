import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
    let errorMessage: string;
    let notFound = false;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.data.message || error.statusText;
        if(errorMessage === "Not Found") {
          notFound = true;
          errorMessage = "This page does not exist!"
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

  console.error(error);

  return (
    <div id="error-page">
      <h1 className="m-6">Oops!</h1>
      { !notFound && <p>Sorry, an unexpected error has occurred.</p>}
      <p>
          <i>{errorMessage}</i>
      </p>
    </div>
  );
}