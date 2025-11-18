import Image from 'next/image';

interface OAuthButtonsProps {
  isLoading?: boolean;
}

export function OAuthButtons({ isLoading }: OAuthButtonsProps) {
  const handleOAuth = (provider: 'github' | 'google') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/api/v1/auth/${provider}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#0a0f1c] px-2 text-white/50">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOAuth('github')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/icons/github.svg" alt="GitHub" width={20} height={20} className="invert" />
          <span className="text-sm text-white">GitHub</span>
        </button>

        <button
          onClick={() => handleOAuth('google')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
          <span className="text-sm text-white">Google</span>
        </button>
      </div>
    </div>
  );
}

