'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { parseBackendError } from '@/lib/utils/errorHandler';
import { ArrowLeft, BookOpen, Code, FileText, Plus, Save, Trash2, Video, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: string;
  theory_content?: string;
  video_url?: string;
  starter_code?: string;
  solution?: string;
  hints?: string;
  order_index: number;
  xp_reward: number;
  is_active: boolean;
  is_free: boolean;
  test_cases_count?: number;
}

interface TestCase {
  id?: string;
  title: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_index: number;
  timeout_seconds: number;
}

interface Chapter {
  id: string;
  title: string;
  tech_stack_name: string;
  description: string;
}

export default function LessonManagementPage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.chapterId as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'THEORY',
    theory_content: '',
    video_url: '',
    starter_code: '',
    solution: '',
    hints: '',
    order_index: 0,
    xp_reward: 100,
    is_free: true,
  });

  useEffect(() => {
    fetchChapterAndLessons();
  }, [chapterId]);

  const fetchChapterAndLessons = async () => {
    try {
      setIsLoading(true);
      // Fetch chapter details
      const chapterRes = await api.get(`/chapters/${chapterId}/lessons`);
      const chapterData = chapterRes.data.data || chapterRes.data;
      
      // Extract lessons array from the chapter response
      const lessonsData = Array.isArray(chapterData) 
        ? chapterData 
        : (chapterData.lessons || []);
      
      // Set chapter info
      if (chapterData && !Array.isArray(chapterData)) {
        setChapter({
          id: chapterId,
          title: chapterData.title || 'Chapter',
          tech_stack_name: chapterData.tech_stack || '',
          description: chapterData.description || '',
        });
      } else if (lessonsData.length > 0) {
        // Fallback: Get chapter info from first lesson
        setChapter({
          id: chapterId,
          title: lessonsData[0].chapter?.title || 'Chapter',
          tech_stack_name: lessonsData[0].chapter?.tech_stack_name || '',
          description: lessonsData[0].chapter?.description || '',
        });
      }
      
      setLessons(Array.isArray(lessonsData) ? lessonsData : []);
    } catch (error: any) {
      console.error('Failed to fetch lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestCases = async (lessonId: string) => {
    try {
      const response = await api.get(`/admin/lessons/${lessonId}/test-cases`);
      setTestCases(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
      setTestCases([]);
    }
  };

  const handleAddLesson = () => {
    setEditingLesson(null);
    setFormData({
      title: '',
      description: '',
      type: 'THEORY',
      theory_content: '',
      video_url: '',
      starter_code: '',
      solution: '',
      hints: '',
      order_index: lessons.length,
      xp_reward: 100,
      is_free: true,
    });
    setShowAddModal(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      theory_content: lesson.theory_content || '',
      video_url: lesson.video_url || '',
      starter_code: lesson.starter_code || '',
      solution: lesson.solution || '',
      hints: lesson.hints || '',
      order_index: lesson.order_index,
      xp_reward: lesson.xp_reward,
      is_free: lesson.is_free,
    });
    setShowAddModal(true);
  };

  const handleSubmitLesson = async () => {
    try {
      const payload = {
        ...formData,
        chapter_id: chapterId,
      };

      if (editingLesson) {
        await api.put(`/admin/lessons/${editingLesson.id}`, payload);
        toast.success('Lesson updated successfully!');
      } else {
        await api.post('/admin/lessons', payload);
        toast.success('Lesson created successfully!');
      }

      setShowAddModal(false);
      fetchChapterAndLessons();
    } catch (error: any) {
      console.error('Failed to save lesson:', error);
      toast.error(parseBackendError(error, 'Failed to save lesson'));
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      toast.success('Lesson deleted successfully!');
      fetchChapterAndLessons();
    } catch (error: any) {
      console.error('Failed to delete lesson:', error);
      toast.error(parseBackendError(error, 'Failed to delete lesson'));
    }
  };

  const handleManageTestCases = async (lessonId: string) => {
    setCurrentLessonId(lessonId);
    await fetchTestCases(lessonId);
    setShowTestCaseModal(true);
  };

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      {
        title: '',
        input: '',
        expected_output: '',
        is_hidden: false,
        order_index: testCases.length,
        timeout_seconds: 30,
      },
    ]);
  };

  const handleUpdateTestCase = (index: number, field: string, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSaveTestCases = async () => {
    if (!currentLessonId) return;

    try {
      // Save test cases with auto-assigned order_index
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        // Ensure all required fields are present
        const payload = {
          lesson_id: currentLessonId,
          title: testCase.title || `Test Case ${i + 1}`,
          input: testCase.input || '',
          expected_output: testCase.expected_output || '',
          is_hidden: testCase.is_hidden || false,
          order_index: i,
          timeout_seconds: testCase.timeout_seconds || 30,
        };

        console.log('Saving test case:', payload); // Debug log

        if (testCase.id) {
          // Update existing test case
          await api.put(`/admin/test-cases/${testCase.id}`, payload);
        } else {
          // Create new test case
          await api.post('/admin/test-cases', payload);
        }
      }

      toast.success('Test cases saved successfully!');
      setShowTestCaseModal(false);
      fetchChapterAndLessons();
    } catch (error: any) {
      console.error('Failed to save test cases:', error);
      toast.error(parseBackendError(error, 'Failed to save test cases'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] pt-24 px-4">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] pt-24 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Content Management
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            Manage Lessons - {chapter?.title}
          </h1>
          <p className="text-white/70">{chapter?.description}</p>
        </div>

        {/* Add Lesson Button */}
        <div className="mb-6">
          <button
            onClick={handleAddLesson}
            className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-black rounded-lg hover:bg-[#00b8e6] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Lesson
          </button>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <GlassCard padding="lg">
              <p className="text-center text-white/50">No lessons yet. Add your first lesson!</p>
            </GlassCard>
          ) : (
            lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((lesson) => (
                <GlassCard key={lesson.id} padding="lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-white/50">#{lesson.order_index}</span>
                        {lesson.type === 'THEORY' ? (
                          <BookOpen className="w-5 h-5 text-[#00d4ff]" />
                        ) : (
                          <Code className="w-5 h-5 text-[#8b5cf6]" />
                        )}
                        <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            lesson.type === 'THEORY'
                              ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                              : 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                          }`}
                        >
                          {lesson.type}
                        </span>
                      </div>
                      <p className="text-white/70 mb-3">{lesson.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span>{lesson.xp_reward} XP</span>
                        {lesson.type === 'ASSIGNMENT' && (
                          <span>{lesson.test_cases_count || 0} test cases</span>
                        )}
                        {lesson.video_url && (
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            Video available
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.type === 'ASSIGNMENT' && (
                        <button
                          onClick={() => handleManageTestCases(lesson.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#00d4ff] transition-colors"
                          title="Manage test cases"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditLesson(lesson)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        title="Edit lesson"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))
          )}
        </div>
      </div>

      {/* Add/Edit Lesson Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <GlassCard padding="lg" className="w-full max-w-3xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Title <span className="text-white/40 text-xs">(min 3 characters)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
                  placeholder="e.g., Introduction to Variables"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description <span className="text-white/40 text-xs">(min 5 characters)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff] h-20"
                  placeholder="Brief description of what students will learn in this lesson..."
                />
              </div>

              {/* Type and XP Reward */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff] appearance-none cursor-pointer"
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgba(255,255,255,0.5)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="THEORY" className="bg-[#0a0f1c] text-white">Theory</option>
                    <option value="ASSIGNMENT" className="bg-[#0a0f1c] text-white">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">XP Reward</label>
                  <input
                    type="number"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
                    min="10"
                    max="1000"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Theory Content (if type is THEORY) */}
              {formData.type === 'THEORY' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Video URL (YouTube)
                    </label>
                    <input
                      type="text"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Theory Content (Markdown)
                    </label>
                    <textarea
                      value={formData.theory_content}
                      onChange={(e) => setFormData({ ...formData, theory_content: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff] h-40 font-mono text-sm"
                      placeholder="# Introduction to Variables&#10;&#10;Variables are..."
                    />
                  </div>
                </>
              )}

              {/* Assignment Content (if type is ASSIGNMENT) */}
              {formData.type === 'ASSIGNMENT' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Starter Code
                    </label>
                    <textarea
                      value={formData.starter_code}
                      onChange={(e) => setFormData({ ...formData, starter_code: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff] h-32 font-mono text-sm"
                      placeholder="func main() {&#10;  // Your code here&#10;}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Solution
                    </label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff] h-32 font-mono text-sm"
                      placeholder="func main() {&#10;  fmt.Println(&quot;Hello&quot;)&#10;}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Hints (JSON array)
                    </label>
                    <input
                      type="text"
                      value={formData.hints}
                      onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
                      placeholder='["Hint 1", "Hint 2"]'
                    />
                  </div>
                </>
              )}

              {/* Order Index */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Order Index</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Free Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_free" className="text-sm text-white/70">
                  Free lesson
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLesson}
                className="px-4 py-2 rounded-lg bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium transition-colors"
              >
                {editingLesson ? 'Update' : 'Create'} Lesson
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Test Cases Modal */}
      {showTestCaseModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <GlassCard padding="lg" className="w-full max-w-4xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Test Cases</h2>
              <button
                onClick={() => setShowTestCaseModal(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {testCases.map((testCase, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-medium">Test Case #{index + 1}</h3>
                    <button
                      onClick={() => handleRemoveTestCase(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={testCase.title}
                      onChange={(e) => handleUpdateTestCase(index, 'title', e.target.value)}
                      placeholder="Test case title"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <textarea
                        value={testCase.input}
                        onChange={(e) => handleUpdateTestCase(index, 'input', e.target.value)}
                        placeholder="Input"
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm h-20 font-mono"
                      />
                      <textarea
                        value={testCase.expected_output}
                        onChange={(e) =>
                          handleUpdateTestCase(index, 'expected_output', e.target.value)
                        }
                        placeholder="Expected output"
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm h-20 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-white/70">
                        <input
                          type="checkbox"
                          checked={testCase.is_hidden}
                          onChange={(e) =>
                            handleUpdateTestCase(index, 'is_hidden', e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                        Hidden
                      </label>
                      <input
                        type="number"
                        value={testCase.timeout_seconds}
                        onChange={(e) =>
                          handleUpdateTestCase(index, 'timeout_seconds', parseInt(e.target.value))
                        }
                        placeholder="Timeout (sec)"
                        className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddTestCase}
              className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-white/50 hover:text-white hover:border-white/40 transition-colors mb-4"
            >
              + Add Test Case
            </button>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowTestCaseModal(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTestCases}
                className="px-4 py-2 rounded-lg bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium transition-colors"
              >
                Save Test Cases
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

