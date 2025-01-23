/**
 * LoadingDots component - Displays animated loading dots
 * Can be used anywhere in the application where loading state needs to be shown
 */
export const LoadingDots = () => {
  return (
    <span className="inline-flex items-center">
      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
        .
      </span>
      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
        .
      </span>
      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
        .
      </span>
    </span>
  );
};
