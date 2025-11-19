'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

export default function TermsPage() {
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
              alt="LearnMore"
              width={64}
              height={64}
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/60">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <GlassCard padding="lg" glow="purple" className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-white/70">
              By accessing and using LearnMore, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Use License</h2>
            <p className="text-white/70 mb-3">
              We grant you a personal, non-exclusive, non-transferable license to use LearnMore for 
              educational purposes, subject to these terms:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You may not share your account credentials</li>
              <li>You may not use the service for any illegal purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. User Content</h2>
            <p className="text-white/70">
              You retain ownership of any code or content you submit through our platform. By submitting 
              content, you grant us a license to use, modify, and display that content solely for the 
              purpose of providing our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Prohibited Activities</h2>
            <p className="text-white/70 mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Submit malicious code or harmful content</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Scrape or harvest data from our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Service Modifications</h2>
            <p className="text-white/70">
              We reserve the right to modify or discontinue, temporarily or permanently, the service 
              with or without notice. We shall not be liable to you or any third party for any 
              modification, suspension, or discontinuance of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p className="text-white/70">
              LearnMore is provided &apos;as is&apos; without warranties of any kind. We shall not be liable for 
              any damages arising from the use or inability to use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Changes to Terms</h2>
            <p className="text-white/70">
              We reserve the right to update these terms at any time. We will notify users of any 
              material changes via email or through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Contact Information</h2>
            <p className="text-white/70">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@learnmore.com" className="text-[#8b5cf6] hover:underline">
                legal@learnmore.com
              </a>
            </p>
          </section>
        </GlassCard>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-[#8b5cf6] hover:text-white transition-colors"
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

