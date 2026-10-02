import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Shield, Code, CheckCircle, 
  AlertTriangle, X, Loader2, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/useToast';
import { 
  getAllProblems, 
  createAdminProblem, 
  updateAdminProblem, 
  deleteAdminProblem 
} from '../../services/apiService';

const INITIAL_FORM = {
  title: '',
  description: '',
  difficulty: 'Easy',
  points: 10,
  acceptance: '60.0%',
  testCases: '[{"input": "1", "output": "1"}]'
};

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete modal state
  const [deletingProblem, setDeletingProblem] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { toast } = useToast();

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await getAllProblems();
      setProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({
        title: 'Failed to load problems',
        description: err.message || 'Could not fetch problem list',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProblem(null);
    setFormData(INITIAL_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title || '',
      description: problem.description || '',
      difficulty: problem.difficulty || 'Easy',
      points: problem.points || 10,
      acceptance: problem.acceptance || '60.0%',
      testCases: problem.testCases || '[]',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProblem(null);
    setFormData(INITIAL_FORM);
    setFormError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic client validation
    if (!formData.title.trim()) {
      setFormError('Problem title is required');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Problem description is required');
      return;
    }
    if (!formData.points || formData.points < 1) {
      setFormError('Points must be at least 1');
      return;
    }

    // Validate testCases JSON format
    if (formData.testCases) {
      try {
        JSON.parse(formData.testCases);
      } catch (err) {
        setFormError('Test cases must be valid JSON format (e.g. [{"input":"1","output":"1"}])');
        return;
      }
    }

    try {
      setFormSubmitting(true);
      if (editingProblem) {
        await updateAdminProblem(editingProblem.id, formData);
        toast({
          title: 'Problem Updated',
          description: `"${formData.title}" has been updated successfully.`,
          variant: 'success',
        });
      } else {
        await createAdminProblem(formData);
        toast({
          title: 'Problem Created',
          description: `"${formData.title}" has been added successfully.`,
          variant: 'success',
        });
      }
      handleCloseModal();
      await fetchProblems();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
      toast({
        title: 'Operation Failed',
        description: err.message || 'Could not save problem',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProblem) return;

    try {
      setDeleteSubmitting(true);
      await deleteAdminProblem(deletingProblem.id);
      toast({
        title: 'Problem Deleted',
        description: `"${deletingProblem.title}" and its submissions have been deleted.`,
        variant: 'success',
      });
      setDeletingProblem(null);
      await fetchProblems();
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: err.message || 'Could not delete problem',
        variant: 'destructive',
      });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Filter problems
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = 
      (problem.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = 
      selectedDifficulty === 'ALL' || 
      (problem.difficulty || '').toUpperCase() === selectedDifficulty.toUpperCase();

    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (diff) => {
    switch ((diff || '').toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const easyCount = problems.filter(p => (p.difficulty || '').toLowerCase() === 'easy').length;
  const mediumCount = problems.filter(p => (p.difficulty || '').toLowerCase() === 'medium').length;
  const hardCount = problems.filter(p => (p.difficulty || '').toLowerCase() === 'hard').length;

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Problem Management
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Create, update, and manage competitive programming problems for students
            </p>
          </div>

          <Button 
            onClick={handleOpenCreateModal}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium rounded-xl px-5 py-2.5 shadow-lg shadow-purple-600/20 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Problem
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Problems</p>
                <p className="text-2xl font-bold text-white mt-1">{problems.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Code className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Easy</p>
                <p className="text-2xl font-bold text-white mt-1">{easyCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Medium</p>
                <p className="text-2xl font-bold text-white mt-1">{mediumCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Hard</p>
                <p className="text-2xl font-bold text-white mt-1">{hardCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search problems by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus:border-purple-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === diff 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          {loading ? (
            <div className="p-16 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-400" />
              <p>Loading problems...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              <Code className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-lg font-medium text-white">No problems found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or difficulty filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Problem Title</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Points</th>
                    <th className="py-4 px-6">Acceptance</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredProblems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="py-4 px-6 text-gray-400 font-mono">#{problem.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                          <span>{problem.title}</span>
                          <Link 
                            to={`/problem/${problem.id}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity"
                            title="Preview Problem Solver"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 max-w-md">
                          {problem.description}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-300">{problem.points} pts</td>
                      <td className="py-4 px-6 text-gray-400">{problem.acceptance || '0.0%'}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(problem)}
                            className="h-8 px-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                            title="Edit Problem"
                          >
                            <Edit3 className="w-4 h-4 text-purple-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingProblem(problem)}
                            className="h-8 px-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0f0f17] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                {editingProblem ? 'Edit Problem' : 'Create New Problem'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {editingProblem 
                  ? 'Update problem parameters and test cases' 
                  : 'Add a new problem to the competitive programming sheets'}
              </p>
            </div>

            {formError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                  Problem Title *
                </label>
                <Input 
                  type="text"
                  placeholder="e.g. Two Sum"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-purple-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-[#181824] border border-white/10 text-white rounded-xl h-11 px-3 text-sm focus:border-purple-500/50 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                    Points *
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    placeholder="10"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-purple-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                    Acceptance Rate
                  </label>
                  <Input 
                    type="text"
                    placeholder="e.g. 55.4%"
                    value={formData.acceptance}
                    onChange={(e) => setFormData({ ...formData, acceptance: e.target.value })}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                  Problem Description (Markdown / Text) *
                </label>
                <textarea 
                  rows={5}
                  placeholder="Detailed description, constraints, and examples..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-purple-500/50 focus:outline-none placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                  Test Cases (JSON format)
                </label>
                <textarea 
                  rows={3}
                  placeholder='[{"input": "...", "output": "..."}]'
                  value={formData.testCases}
                  onChange={(e) => setFormData({ ...formData, testCases: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 font-mono text-xs text-purple-300 rounded-xl p-3 focus:border-purple-500/50 focus:outline-none placeholder:text-gray-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Format: JSON array of objects with "input" and "output" fields.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleCloseModal}
                  className="rounded-xl px-5 hover:bg-white/10"
                  disabled={formSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl px-6 shadow-lg shadow-purple-600/20"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    editingProblem ? 'Update Problem' : 'Create Problem'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0f0f17] border border-red-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Problem</h3>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{deletingProblem.title}"</span>? All related submissions and student records for this problem will also be removed.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setDeletingProblem(null)}
                className="rounded-xl px-4 hover:bg-white/10"
                disabled={deleteSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 shadow-lg shadow-red-600/20"
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProblems;
