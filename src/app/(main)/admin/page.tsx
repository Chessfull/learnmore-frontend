'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { parseBackendError } from '@/lib/utils/errorHandler';
import { useAuthStore } from '@/store/authStore';
import { Book, Edit, FolderTree, Globe, Plus, Trash2, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [techStacks, setTechStacks] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showAddChallengeModal, setShowAddChallengeModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [editingChallenge, setEditingChallenge] = useState<any | null>(null);
  const [chapterFormData, setChapterFormData] = useState({
    title: '',
    description: '',
    order_index: 0,
  });
  const [challengeFormData, setChallengeFormData] = useState({
    type: 'QUIZ',
    title: '',
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    starter_code: '',
    test_cases: [{ input: '', expected_output: '', is_hidden: false }],
    hints: [''],
    solution: '',
    difficulty: 'BEGINNER',
    xp_reward_correct: 50,
    xp_reward_wrong: 10,
    time_limit: 60,
    is_active: true,
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      toast.error('Access denied. Admin only.');
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchTechStacks();
  }, []);

  useEffect(() => {
    if (selectedTechStack) {
      fetchChapters(selectedTechStack);
      fetchChallenges(selectedTechStack);
    }
  }, [selectedTechStack]);

  const fetchTechStacks = async () => {
    try {
      const response = await api.get('/tech-stacks');
      setTechStacks(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tech stacks:', error);
      toast.error('Failed to load tech stacks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChapters = async (techStack: string) => {
    try {
      const response = await api.get(`/tech-stacks/${techStack}/chapters`);
      setChapters(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      toast.error('Failed to load chapters');
    }
  };

  const fetchChallenges = async (techStack: string) => {
    try {
      const response = await api.get(`/admin/challenges?tech_stack=${techStack}`);
      setChallenges(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      toast.error('Failed to load challenges');
    }
  };

  const handleAddChapter = () => {
    if (!selectedTechStack) {
      toast.error('Please select a tech stack first');
      return;
    }
    setEditingChapter(null);
    setChapterFormData({
      title: '',
      description: '',
      order_index: chapters.length,
    });
    setShowAddChapterModal(true);
  };

  const handleEditChapter = (chapter: any) => {
    setEditingChapter(chapter);
    setChapterFormData({
      title: chapter.title,
      description: chapter.description,
      order_index: chapter.order_index,
    });
    setShowAddChapterModal(true);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This will also delete all lessons in this chapter.')) {
      return;
    }

    try {
      await api.delete(`/admin/chapters/${chapterId}`);
      toast.success('Chapter deleted successfully!');
      fetchChapters(selectedTechStack);
    } catch (error: any) {
      console.error('Failed to delete chapter:', error);
      toast.error(parseBackendError(error, 'Failed to delete chapter'));
    }
  };

  const handleSubmitChapter = async () => {
    if (!chapterFormData.title.trim()) {
      toast.error('Chapter title is required');
      return;
    }

    try {
      if (editingChapter) {
        await api.put(`/admin/chapters/${editingChapter.id}`, {
          title: chapterFormData.title,
          description: chapterFormData.description,
          order_index: chapterFormData.order_index,
        });
        toast.success('Chapter updated successfully!');
      } else {
        await api.post('/admin/chapters', {
          tech_stack_name: selectedTechStack,
          title: chapterFormData.title,
          description: chapterFormData.description,
          order_index: chapterFormData.order_index,
          is_active: true,
        });
        toast.success('Chapter created successfully!');
      }
      setShowAddChapterModal(false);
      setEditingChapter(null);
      fetchChapters(selectedTechStack);
    } catch (error: any) {
      console.error('Failed to save chapter:', error);
      toast.error(parseBackendError(error, 'Failed to save chapter'));
    }
  };

  const handleAddChallenge = () => {
    if (!selectedTechStack) {
      toast.error('Please select a tech stack first');
      return;
    }
    setEditingChallenge(null);
    setChallengeFormData({
      type: 'QUIZ',
      title: '',
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      starter_code: '',
      test_cases: [{ input: '', expected_output: '', is_hidden: false }],
      hints: [''],
      solution: '',
      difficulty: 'BEGINNER',
      xp_reward_correct: 50,
      xp_reward_wrong: 10,
      time_limit: 60,
      is_active: true,
    });
    setShowAddChallengeModal(true);
  };

  const handleEditChallenge = (challenge: any) => {
    setEditingChallenge(challenge);
    
    // Parse options and test_cases if they're strings
    let parsedOptions = challenge.options;
    let parsedTestCases = challenge.test_cases;
    let parsedHints = challenge.hints;
    
    try {
      if (typeof challenge.options === 'string') {
        parsedOptions = JSON.parse(challenge.options);
      }
      if (typeof challenge.test_cases === 'string') {
        parsedTestCases = JSON.parse(challenge.test_cases);
      }
      if (typeof challenge.hints === 'string') {
        parsedHints = JSON.parse(challenge.hints);
      }
    } catch (e) {
      console.error('Failed to parse challenge data:', e);
    }

    // Convert options from object format to string array
    let optionsArray = ['', '', '', ''];
    if (Array.isArray(parsedOptions)) {
      optionsArray = parsedOptions.map((opt: any) => 
        typeof opt === 'string' ? opt : opt.text || ''
      );
    }

    setChallengeFormData({
      type: challenge.type,
      title: challenge.title,
      question: challenge.question,
      options: optionsArray,
      correct_answer: challenge.correct_answer || '',
      starter_code: challenge.starter_code || '',
      test_cases: Array.isArray(parsedTestCases) && parsedTestCases.length > 0 
        ? parsedTestCases 
        : [{ input: '', expected_output: '', is_hidden: false }],
      hints: Array.isArray(parsedHints) && parsedHints.length > 0 ? parsedHints : [''],
      solution: challenge.solution || '',
      difficulty: challenge.difficulty,
      xp_reward_correct: challenge.xp_reward_correct,
      xp_reward_wrong: challenge.xp_reward_wrong,
      time_limit: challenge.time_limit,
      is_active: challenge.is_active,
    });
    setShowAddChallengeModal(true);
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) {
      return;
    }

    try {
      await api.delete(`/admin/challenges/${challengeId}`);
      toast.success('Challenge deleted successfully!');
      fetchChallenges(selectedTechStack);
    } catch (error: any) {
      console.error('Failed to delete challenge:', error);
      toast.error(parseBackendError(error, 'Failed to delete challenge'));
    }
  };

  const handleSubmitChallenge = async () => {
    if (!challengeFormData.title.trim() || !challengeFormData.question.trim()) {
      toast.error('Title and question are required');
      return;
    }

    // Additional validation for QUIZ
    if (challengeFormData.type === 'QUIZ') {
      const validOptions = challengeFormData.options.filter(o => o.trim());
      if (validOptions.length < 2) {
        toast.error('Quiz must have at least 2 options');
        return;
      }
      if (!challengeFormData.correct_answer) {
        toast.error('Please select a correct answer');
        return;
      }
    }

    // Additional validation for CODE
    if (challengeFormData.type === 'CODE') {
      if (!challengeFormData.starter_code.trim()) {
        toast.error('Starter code is required for code challenges');
        return;
      }
      const validTestCases = challengeFormData.test_cases.filter(tc => tc.input || tc.expected_output);
      if (validTestCases.length === 0) {
        toast.error('At least one test case is required');
        return;
      }
      if (!challengeFormData.solution.trim()) {
        toast.error('Solution is required for code challenges');
        return;
      }
    }

    try {
      const payload: any = {
        type: challengeFormData.type,
        title: challengeFormData.title,
        question: challengeFormData.question,
        difficulty: challengeFormData.difficulty,
        xp_reward_correct: challengeFormData.xp_reward_correct,
        xp_reward_wrong: challengeFormData.xp_reward_wrong,
        time_limit: challengeFormData.time_limit,
        tech_stack: selectedTechStack,
        is_active: challengeFormData.is_active,
      };

      if (challengeFormData.type === 'QUIZ') {
        // Format options as array of objects with text and is_correct
        const formattedOptions = challengeFormData.options
          .filter(o => o.trim())
          .map((option, index) => ({
            text: option,
            is_correct: String.fromCharCode(65 + index) === challengeFormData.correct_answer // A, B, C, D
          }));
        payload.options = JSON.stringify(formattedOptions);
        payload.correct_answer = challengeFormData.correct_answer;
        // For QUIZ, set empty valid JSON for CODE fields
        payload.test_cases = "[]";
        payload.hints = "[]";
        payload.starter_code = "";
        payload.solution = "";
      } else {
        payload.starter_code = challengeFormData.starter_code;
        const validTestCases = challengeFormData.test_cases.filter(tc => tc.input || tc.expected_output);
        payload.test_cases = JSON.stringify(validTestCases);
        const validHints = challengeFormData.hints.filter(h => h.trim());
        payload.hints = validHints.length > 0 ? JSON.stringify(validHints) : "[]";
        payload.solution = challengeFormData.solution;
        // For CODE, set empty valid JSON for QUIZ fields
        payload.options = "[]";
        payload.correct_answer = "";
      }

      if (editingChallenge) {
        await api.put(`/admin/challenges/${editingChallenge.id}`, payload);
        toast.success('Challenge updated successfully!');
      } else {
        await api.post('/admin/challenges', payload);
        toast.success('Challenge created successfully!');
      }
      
      setShowAddChallengeModal(false);
      setEditingChallenge(null);
      fetchChallenges(selectedTechStack);
    } catch (error: any) {
      console.error('Failed to save challenge:', error);
      toast.error(parseBackendError(error, 'Failed to save challenge'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] p-6 lg:p-8">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-white/60">Manage tech stacks, chapters, and lessons</p>
        </div>

        {/* Tech Stacks Section */}
        <GlassCard padding="lg" glow="cyan">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#00d4ff]" />
              <h2 className="text-xl font-bold text-white">Tech Stacks</h2>
            </div>
            <button className="px-4 py-2 bg-[#00d4ff] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add Tech Stack
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStacks.map((stack) => (
              <button
                key={stack.name}
                onClick={() => setSelectedTechStack(stack.name)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTechStack === stack.name
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <h3 className="text-white font-semibold mb-1">{stack.display_name}</h3>
                <p className="text-xs text-white/60">{stack.description}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Chapters Section */}
        {selectedTechStack && (
          <GlassCard padding="lg" glow="purple">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#8b5cf6]" />
                <h2 className="text-xl font-bold text-white">
                  Chapters - {techStacks.find(ts => ts.name === selectedTechStack)?.display_name}
                </h2>
              </div>
              <button 
                onClick={handleAddChapter}
                className="px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </div>

            <div className="space-y-3">
              {chapters.length === 0 ? (
                <p className="text-white/50 text-center py-8">No chapters yet</p>
              ) : (
                chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#8b5cf6]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[#8b5cf6] font-bold">{index + 1}</span>
                          <div>
                            <h3 className="text-white font-semibold">{chapter.title}</h3>
                            <p className="text-xs text-white/60 mt-1">{chapter.description}</p>
                            <p className="text-xs text-white/40 mt-1">
                              {chapter.lesson_count || 0} lessons • Order: {chapter.order_index}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditChapter(chapter)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                          title="Edit chapter"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/lessons/${chapter.id}`)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                        >
                          <Book className="w-4 h-4" />
                          Manage Lessons
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        )}

        {/* Challenges Section */}
        {selectedTechStack && (
          <GlassCard padding="lg" glow="yellow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#fbbf24]" />
                <h2 className="text-xl font-bold text-white">
                  Challenges - {techStacks.find(ts => ts.name === selectedTechStack)?.display_name}
                </h2>
              </div>
              <button 
                onClick={handleAddChallenge}
                className="px-4 py-2 bg-[#fbbf24] text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Challenge
              </button>
            </div>

            <div className="space-y-3">
              {challenges.length === 0 ? (
                <p className="text-white/50 text-center py-8">No challenges yet</p>
              ) : (
                challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#fbbf24]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.type === 'QUIZ' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {challenge.type}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.difficulty === 'BEGINNER' 
                              ? 'bg-green-500/20 text-green-400'
                              : challenge.difficulty === 'INTERMEDIATE'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold">{challenge.title}</h3>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">{challenge.question}</p>
                        <p className="text-xs text-white/40 mt-2">
                          ✓ {challenge.xp_reward_correct} XP • ✗ {challenge.xp_reward_wrong} XP • ⏱ {challenge.time_limit}s
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditChallenge(challenge)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                          title="Edit challenge"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChallenge(challenge.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete challenge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        )}

        {/* Instructions */}
        <GlassCard padding="md" glow="green">
          <div className="text-sm text-white/70">
            <h3 className="font-semibold text-white mb-2">ℹ️ Quick Guide</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Select a tech stack to view and manage its chapters and challenges</li>
              <li>Click "Manage Lessons" to add/edit lessons for a chapter</li>
              <li>Click "Add Challenge" to create quiz or code challenges</li>
              <li>Each lesson can include theory content, video URL, starter code, and test cases</li>
            </ul>
          </div>
        </GlassCard>
      </div>

      {/* Add Challenge Modal */}
      {showAddChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-lg p-6 max-w-4xl w-full my-8 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingChallenge ? 'Edit Challenge' : 'Add New Challenge'}
            </h3>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Type & Tech Stack */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Challenge Type *
                  </label>
                  <select
                    value={challengeFormData.type}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, type: e.target.value as 'QUIZ' | 'CODE' })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fbbf24]"
                  >
                    <option value="QUIZ" className="bg-[#0a0f1c]">Quiz</option>
                    <option value="CODE" className="bg-[#0a0f1c]">Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Tech Stack
                  </label>
                  <div className="text-white font-semibold px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                    {techStacks.find(ts => ts.name === selectedTechStack)?.display_name}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  value={challengeFormData.title}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24]"
                  placeholder="e.g., Go Variable Declaration"
                />
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Question *
                </label>
                <textarea
                  value={challengeFormData.question}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, question: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] min-h-[100px]"
                  placeholder="Enter the challenge question..."
                />
              </div>

              {/* Quiz-specific fields */}
              {challengeFormData.type === 'QUIZ' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Options (4 options)
                    </label>
                    {challengeFormData.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...challengeFormData.options];
                          newOptions[index] = e.target.value;
                          setChallengeFormData({ ...challengeFormData, options: newOptions });
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] mb-2"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Correct Answer *
                    </label>
                    <select
                      value={challengeFormData.correct_answer}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, correct_answer: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fbbf24]"
                    >
                      <option value="" className="bg-[#0a0f1c]">Select correct answer</option>
                      <option value="A" className="bg-[#0a0f1c]">A</option>
                      <option value="B" className="bg-[#0a0f1c]">B</option>
                      <option value="C" className="bg-[#0a0f1c]">C</option>
                      <option value="D" className="bg-[#0a0f1c]">D</option>
                    </select>
                  </div>
                </>
              )}

              {/* Code-specific fields */}
              {challengeFormData.type === 'CODE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Starter Code
                    </label>
                    <textarea
                      value={challengeFormData.starter_code}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, starter_code: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] font-mono text-sm min-h-[150px]"
                      placeholder="Initial code template..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Test Cases
                    </label>
                    {challengeFormData.test_cases.map((tc, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/70">Test Case {index + 1}</span>
                          {challengeFormData.test_cases.length > 1 && (
                            <button
                              onClick={() => {
                                const newTestCases = challengeFormData.test_cases.filter((_, i) => i !== index);
                                setChallengeFormData({ ...challengeFormData, test_cases: newTestCases });
                              }}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={tc.input}
                          onChange={(e) => {
                            const newTestCases = [...challengeFormData.test_cases];
                            newTestCases[index].input = e.target.value;
                            setChallengeFormData({ ...challengeFormData, test_cases: newTestCases });
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] text-sm mb-2 font-mono"
                          placeholder="Input (e.g., '5 10')"
                        />
                        <input
                          type="text"
                          value={tc.expected_output}
                          onChange={(e) => {
                            const newTestCases = [...challengeFormData.test_cases];
                            newTestCases[index].expected_output = e.target.value;
                            setChallengeFormData({ ...challengeFormData, test_cases: newTestCases });
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] text-sm mb-2 font-mono"
                          placeholder="Expected Output (e.g., '15')"
                        />
                        <label className="flex items-center gap-2 text-xs text-white/70">
                          <input
                            type="checkbox"
                            checked={tc.is_hidden}
                            onChange={(e) => {
                              const newTestCases = [...challengeFormData.test_cases];
                              newTestCases[index].is_hidden = e.target.checked;
                              setChallengeFormData({ ...challengeFormData, test_cases: newTestCases });
                            }}
                            className="w-4 h-4"
                          />
                          Hidden Test Case
                        </label>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setChallengeFormData({
                          ...challengeFormData,
                          test_cases: [...challengeFormData.test_cases, { input: '', expected_output: '', is_hidden: false }]
                        });
                      }}
                      className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Hints (optional)
                    </label>
                    {challengeFormData.hints.map((hint, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={hint}
                          onChange={(e) => {
                            const newHints = [...challengeFormData.hints];
                            newHints[index] = e.target.value;
                            setChallengeFormData({ ...challengeFormData, hints: newHints });
                          }}
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] text-sm"
                          placeholder={`Hint ${index + 1}`}
                        />
                        {challengeFormData.hints.length > 1 && (
                          <button
                            onClick={() => {
                              const newHints = challengeFormData.hints.filter((_, i) => i !== index);
                              setChallengeFormData({ ...challengeFormData, hints: newHints });
                            }}
                            className="text-red-400 hover:text-red-300 text-xs px-3"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setChallengeFormData({
                          ...challengeFormData,
                          hints: [...challengeFormData.hints, '']
                        });
                      }}
                      className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors"
                    >
                      + Add Hint
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Solution (optional, for internal use)
                    </label>
                    <textarea
                      value={challengeFormData.solution}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, solution: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#fbbf24] font-mono text-sm min-h-[100px]"
                      placeholder="Full solution code..."
                    />
                  </div>
                </>
              )}

              {/* Difficulty, XP, Time */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={challengeFormData.difficulty}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fbbf24]"
                  >
                    <option value="BEGINNER" className="bg-[#0a0f1c]">Beginner</option>
                    <option value="INTERMEDIATE" className="bg-[#0a0f1c]">Intermediate</option>
                    <option value="ADVANCED" className="bg-[#0a0f1c]">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    XP (Correct)
                  </label>
                  <input
                    type="number"
                    value={challengeFormData.xp_reward_correct}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, xp_reward_correct: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fbbf24]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    XP (Wrong)
                  </label>
                  <input
                    type="number"
                    value={challengeFormData.xp_reward_wrong}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, xp_reward_wrong: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fbbf24]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Time (sec)
                  </label>
                  <input
                    type="number"
                    value={challengeFormData.time_limit}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, time_limit: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#fbbf24]"
                  />
                </div>
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={challengeFormData.is_active}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm text-white/70">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddChallengeModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitChallenge}
                className="flex-1 px-4 py-2 bg-[#fbbf24] hover:opacity-90 text-black rounded-lg transition-opacity font-medium"
              >
                {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-lg p-6 max-w-md w-full shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Tech Stack
                </label>
                <div className="text-white font-semibold">
                  {techStacks.find(ts => ts.name === selectedTechStack)?.display_name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  value={chapterFormData.title}
                  onChange={(e) => setChapterFormData({ ...chapterFormData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="e.g., Getting Started"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  value={chapterFormData.description}
                  onChange={(e) => setChapterFormData({ ...chapterFormData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#8b5cf6] min-h-[100px]"
                  placeholder="Describe what students will learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  value={chapterFormData.order_index}
                  onChange={(e) => setChapterFormData({ ...chapterFormData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddChapterModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitChapter}
                className="flex-1 px-4 py-2 bg-[#8b5cf6] hover:opacity-90 text-white rounded-lg transition-opacity"
              >
                {editingChapter ? 'Update Chapter' : 'Create Chapter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Stars */}
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

