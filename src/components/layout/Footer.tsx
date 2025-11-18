import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0a0f1c]/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-linear-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white font-bold text-xs">LM</span>
            </div>
            <span className="text-white/50 text-sm">
              © {new Date().getFullYear()} LearnMore. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/50 hover:text-white text-sm">
              About
            </Link>
            <Link href="#" className="text-white/50 hover:text-white text-sm">
              Privacy
            </Link>
            <Link href="#" className="text-white/50 hover:text-white text-sm">
              Terms
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/50 hover:text-white">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/50 hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

