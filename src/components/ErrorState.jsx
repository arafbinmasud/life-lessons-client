import getErrorMessage from "../utils/errorMessage";

const ErrorState = ({ error, onRetry, title = "Failed to load data" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <h3 className="text-xl font-bold text-error">{title}</h3>
      <p className="text-accent text-sm">{getErrorMessage(error)}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-sm btn-outline">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
