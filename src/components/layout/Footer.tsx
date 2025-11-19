import { Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0a0f1c]/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/logo.png"
              alt="LearnMore"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-white/50 text-sm">
              © {new Date().getFullYear()} LearnMore. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-white/50 hover:text-white text-sm transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">
              Terms
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

