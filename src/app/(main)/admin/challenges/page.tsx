'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { parseBackendError } from '@/lib/utils/errorHandler';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  type: 'QUIZ' | 'CODE';
  title: string;
  question: string;
  difficulty: string;
  tech_stack: string;
  xp_reward_correct: number;
  xp_reward_wrong: number;
  time_limit: number;
  is_active: boolean;
}

export default function AdminChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'QUIZ',
    title: '',
    question: '',
    options: '',
    correct_answer: '',
    starter_code: '',
    test_cases: '',
    hints: '',
    solution: '',
    difficulty: 'BEGINNER',
    xp_reward_correct: 50,
    xp_reward_wrong: 10,
    time_limit: 300,
    tech_stack: 'GO',
    is_active: true,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/admin/challenges');
      setChallenges(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch challenges');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingChallenge) {
        await api.put(`/admin/challenges/${editingChallenge.id}`, formData);
        toast.success('Challenge updated!');
      } else {
        await api.post('/admin/challenges', formData);
        toast.success('Challenge created!');
      }
      setShowModal(false);
      fetchChallenges();
      resetForm();
    } catch (error: any) {
      toast.error(parseBackendError(error, 'Failed to save challenge'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this challenge?')) return;
    
    try {
      await api.delete(`/admin/challenges/${id}`);
      toast.success('Challenge deleted!');
      fetchChallenges();
    } catch (error) {
      toast.error('Failed to delete challenge');
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    // Load challenge data into form...
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'QUIZ',
      title: '',
      question: '',
      options: '',
      correct_answer: '',
      starter_code: '',
      test_cases: '',
      hints: '',
      solution: '',
      difficulty: 'BEGINNER',
      xp_reward_correct: 50,
      xp_reward_wrong: 10,
      time_limit: 300,
      tech_stack: 'GO',
      is_active: true,
    });
    setEditingChallenge(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] pt-24 px-6 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Challenges</h1>
            <p className="text-white/70">Create and manage quiz & code challenges</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-black rounded-lg hover:bg-[#00b8e6] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Challenge
          </button>
        </div>

        {/* Challenges List */}
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <GlassCard key={challenge.id} padding="lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      challenge.type === 'QUIZ' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {challenge.type}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-white">
                      {challenge.tech_stack}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-white">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{challenge.question.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>✓ {challenge.xp_reward_correct} XP</span>
                    <span>✗ {challenge.xp_reward_wrong} XP</span>
                    <span>⏱ {challenge.time_limit}s</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(challenge)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <GlassCard padding="lg" className="w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingChallenge ? 'Edit' : 'Add'} Challenge
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-white/70">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type & Tech Stack */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white appearance-none cursor-pointer"
                  >
                    <option value="QUIZ" className="bg-[#0a0f1c]">Quiz</option>
                    <option value="CODE" className="bg-[#0a0f1c]">Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Tech Stack</label>
                  <select
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white appearance-none cursor-pointer"
                  >
                    <option value="GO" className="bg-[#0a0f1c]">Go</option>
                    <option value="PYTHON" className="bg-[#0a0f1c]">Python</option>
                    <option value="JAVA" className="bg-[#0a0f1c]">Java</option>
                    <option value="NODEJS" className="bg-[#0a0f1c]">Node.js</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                />
              </div>

              {/* Question */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white h-24"
                />
              </div>

              {/* Conditional Fields */}
              {formData.type === 'QUIZ' ? (
                <>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Options (JSON)</label>
                    <textarea
                      value={formData.options}
                      onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                      placeholder='[{"text":"Option A","is_correct":true},...]'
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono text-sm h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Correct Answer (A/B/C/D)</label>
                    <input
                      type="text"
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Starter Code</label>
                    <textarea
                      value={formData.starter_code}
                      onChange={(e) => setFormData({ ...formData, starter_code: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono text-sm h-32"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Test Cases (JSON)</label>
                    <textarea
                      value={formData.test_cases}
                      onChange={(e) => setFormData({ ...formData, test_cases: e.target.value })}
                      placeholder='[{"input":"...","expected_output":"...","is_hidden":false}]'
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono text-sm h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Solution</label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono text-sm h-24"
                    />
                  </div>
                </>
              )}

              {/* Difficulty & XP & Time */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white appearance-none cursor-pointer"
                  >
                    <option value="BEGINNER" className="bg-[#0a0f1c]">Beginner</option>
                    <option value="INTERMEDIATE" className="bg-[#0a0f1c]">Intermediate</option>
                    <option value="ADVANCED" className="bg-[#0a0f1c]">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">XP (Correct)</label>
                  <input
                    type="number"
                    value={formData.xp_reward_correct}
                    onChange={(e) => setFormData({ ...formData, xp_reward_correct: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Time (sec)</label>
                  <input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingChallenge ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

