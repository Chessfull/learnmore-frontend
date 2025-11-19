'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] relative">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image
              src="/images/logo/logo.png"
              alt="Learn More"
              width={64}
              height={64}
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <GlassCard padding="lg" glow="cyan" className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="text-white/70 mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Account information (name, email, username)</li>
              <li>Profile information (avatar, display name)</li>
              <li>Learning progress and submissions</li>
              <li>Device and usage information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p className="text-white/70 mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Track your learning progress and achievements</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Information Sharing</h2>
            <p className="text-white/70">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              aggregated, non-personally identifiable information publicly or with our partners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Data Security</h2>
            <p className="text-white/70">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Your Rights</h2>
            <p className="text-white/70 mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Contact Us</h2>
            <p className="text-white/70">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@learnmore.com" className="text-[#00d4ff] hover:underline">
                privacy@learnmore.com
              </a>
            </p>
          </section>
        </GlassCard>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-[#00d4ff] hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent);
          background-size: 250px 250px;
          animation: twinkle 5s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

