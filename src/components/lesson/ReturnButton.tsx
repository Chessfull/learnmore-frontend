'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ReturnButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Return to Dashboard</span>
    </button>
  );
}

