interface ErrorBannerProps {
  message: string;
}

const ErrorBanner = ({ message }: ErrorBannerProps) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorBanner;