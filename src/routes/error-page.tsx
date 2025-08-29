import {useRouteError, isRouteErrorResponse} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.log(error);
    
    let errorMessage: string;
    
    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || error.data;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = 'Unknown error';
    }
    
    return (
        <div id="error-page">
            <h1>Uh-oh!</h1>
            <p>Looks like you have gone rogue!</p>
            <p>
                <i>{errorMessage}</i>
            </p>
            <a href="/">Go home</a>
        </div>
    )
}
