interface ErrorBannerProps {
  error: string | null;
}

const DEFAULT_ERROR_MESSAGE =
  "Failed to connect to Supabase. Check .env.local and messages table.";


export const ErrorBanner = ({ error }: ErrorBannerProps) => {
  if (!error) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 text-sm text-red-100 px-4 py-3">
      {error || DEFAULT_ERROR_MESSAGE}
    </div>
  );
};
