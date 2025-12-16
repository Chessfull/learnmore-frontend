'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#0a0f1c] border border-white/10 shadow-[0_0_40px_rgba(0,212,255,0.3)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0f1c]/95 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6 text-white/80">
          {/* Introduction */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">1. Introduction</h3>
            <p>
              Welcome to Learn More! By accessing and using our space-themed programming learning platform,
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">2. Use License</h3>
            <p className="mb-2">
              We grant you a personal, non-exclusive, non-transferable license to use Learn More for
              educational purposes. This license permits you to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access and complete lessons and challenges</li>
              <li>Track your progress and achievements</li>
              <li>Participate in the community leaderboard</li>
              <li>Submit code for evaluation and feedback</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h3>
            <p className="mb-2">You agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not share your account with others</li>
              <li>Use the platform for legitimate educational purposes only</li>
              <li>Not attempt to exploit, hack, or abuse the platform</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          {/* Content Ownership */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">4. Content Ownership</h3>
            <p>
              All content, materials, and intellectual property on Learn More remain our property or
              the property of our licensors. Your code submissions remain your property, but you grant
              us a license to evaluate and store them for educational purposes.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">5. Privacy</h3>
            <p>
              We collect and process your data in accordance with our Privacy Policy. This includes
              learning progress, code submissions, and usage analytics to improve your learning experience.
            </p>
          </section>

          {/* Gamification */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">6. Gamification & Rewards</h3>
            <p>
              XP points, achievements, and leaderboard rankings are for educational motivation only
              and have no monetary value. We reserve the right to adjust XP calculations and reset
              leaderboards as needed for platform improvements.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">7. Disclaimer</h3>
            <p>
              Learn More is provided &apos;as is&apos; without warranties of any kind. We shall not be
              liable for any damages arising from your use of the platform. We do not guarantee
              continuous, error-free operation or that the platform will meet your specific requirements.
            </p>
          </section>

          {/* Code Execution */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">8. Code Execution</h3>
            <p>
              Code submitted for evaluation is executed in isolated, secure containers. However, you
              must not attempt to submit malicious code or attempt to break out of the sandbox environment.
              Violations will result in account termination.
            </p>
          </section>

          {/* Account Termination */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">9. Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms,
              engage in abusive behavior, or for any other reason at our discretion.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h3>
            <p>
              We may modify these terms at any time. Continued use of the platform after changes
              constitutes acceptance of the modified terms. We will notify users of significant changes.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">11. Contact</h3>
            <p>
              For questions about these terms, please contact us through the platform or via email.
            </p>
          </section>

          {/* Last Updated */}
          <section className="pt-4 border-t border-white/10">
            <p className="text-sm text-white/50">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end p-6 border-t border-white/10 bg-[#0a0f1c]/95 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-semibold hover:scale-105 transition-transform"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

