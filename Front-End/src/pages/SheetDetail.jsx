import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Circle, ExternalLink, Search, Play } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../hooks/useToast'
import { getSolvedProblems } from '../services/apiService'

const SheetDetail = () => {
  const { sheetId } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [solvedProblems, setSolvedProblems] = useState(new Set()) 
  const [isLoading, setIsLoading] = useState(true)

  const sheetData = {
    'striver-sde': { name: 'Striver SDE Sheet', author: 'Raj Vikramaditya', description: 'Complete preparation for SDE', totalProblems: 5, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    'love-babbar-450': { name: 'Love Babbar 450', author: 'Love Babbar', description: 'Most important 450 DSA questions', totalProblems: 5, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    'neetcode-150': { name: 'NeetCode 150', author: 'NeetCode', description: 'Curated list of 150 LeetCode problems', totalProblems: 5, color: 'bg-gradient-to-r from-green-500 to-green-600' },
    'blind-75': { name: 'Blind 75', author: 'Blind Community', description: 'Most popular 75 LeetCode problems', totalProblems: 5, color: 'bg-gradient-to-r from-red-500 to-red-600' },
    'gfg-must-do': { name: 'GeeksforGeeks Must Do', author: 'GeeksforGeeks', description: 'Essential coding problems', totalProblems: 5, color: 'bg-gradient-to-r from-orange-500 to-orange-600' },
    'apna-college': { name: 'Apna College DSA', author: 'Apna College', description: 'Beginner-friendly DSA problems', totalProblems: 5, color: 'bg-gradient-to-r from-teal-500 to-teal-600' }
  }

  const currentSheet = sheetData[sheetId] || sheetData['striver-sde'];

  // --- COMPLETE LIST OF 30 BACKEND PROBLEMS ---
  const allProblems = [
    // Striver (1-5)
    { id: 1, sheetId: 'striver-sde', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Arrays' },
    { id: 2, sheetId: 'striver-sde', title: "Pascal's Triangle", difficulty: 'Easy', topic: 'Arrays' },
    { id: 3, sheetId: 'striver-sde', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays' },
    { id: 4, sheetId: 'striver-sde', title: 'Maximum Subarray', difficulty: 'Easy', topic: 'Arrays' },
    { id: 5, sheetId: 'striver-sde', title: 'Sort Colors', difficulty: 'Medium', topic: 'Arrays' },
    // Love Babbar (6-10)
    { id: 6, sheetId: 'love-babbar-450', title: 'Reverse the Array', difficulty: 'Easy', topic: 'Arrays' },
    { id: 7, sheetId: 'love-babbar-450', title: 'Find Min and Max', difficulty: 'Easy', topic: 'Arrays' },
    { id: 8, sheetId: 'love-babbar-450', title: 'Kth Smallest Element', difficulty: 'Medium', topic: 'Arrays' },
    { id: 9, sheetId: 'love-babbar-450', title: 'Move Negative Numbers', difficulty: 'Medium', topic: 'Arrays' },
    { id: 10, sheetId: 'love-babbar-450', title: 'Union of Two Arrays', difficulty: 'Easy', topic: 'Arrays' },
    // NeetCode (11-15)
    { id: 11, sheetId: 'neetcode-150', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays' },
    { id: 12, sheetId: 'neetcode-150', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings' },
    { id: 13, sheetId: 'neetcode-150', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Strings' },
    { id: 14, sheetId: 'neetcode-150', title: 'Top K Frequent', difficulty: 'Medium', topic: 'Arrays' },
    { id: 15, sheetId: 'neetcode-150', title: 'Product Except Self', difficulty: 'Medium', topic: 'Arrays' },
    // Blind 75 (16-20)
    { id: 16, sheetId: 'blind-75', title: 'Best Time to Buy Stock', difficulty: 'Easy', topic: 'Arrays' },
    { id: 17, sheetId: 'blind-75', title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'Arrays' },
    { id: 18, sheetId: 'blind-75', title: 'Find Min in Rotated', difficulty: 'Medium', topic: 'Arrays' },
    { id: 19, sheetId: 'blind-75', title: 'Search in Rotated', difficulty: 'Medium', topic: 'Binary Search' },
    { id: 20, sheetId: 'blind-75', title: '3Sum', difficulty: 'Medium', topic: 'Arrays' },
    // GFG (21-25)
    { id: 21, sheetId: 'gfg-must-do', title: 'Missing Number', difficulty: 'Easy', topic: 'Arrays' },
    { id: 22, sheetId: 'gfg-must-do', title: 'Subarray with Given Sum', difficulty: 'Easy', topic: 'Arrays' },
    { id: 23, sheetId: 'gfg-must-do', title: 'Leaders in an Array', difficulty: 'Easy', topic: 'Arrays' },
    { id: 24, sheetId: 'gfg-must-do', title: 'Majority Element', difficulty: 'Medium', topic: 'Arrays' },
    { id: 25, sheetId: 'gfg-must-do', title: 'Equilibrium Point', difficulty: 'Easy', topic: 'Arrays' },
    // Apna College (26-30)
    { id: 26, sheetId: 'apna-college', title: 'Search Element', difficulty: 'Easy', topic: 'Arrays' },
    { id: 27, sheetId: 'apna-college', title: 'Chocolate Distribution', difficulty: 'Easy', topic: 'Arrays' },
    { id: 28, sheetId: 'apna-college', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays' },
    { id: 29, sheetId: 'apna-college', title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Matrix' },
    { id: 30, sheetId: 'apna-college', title: 'Search 2D Matrix', difficulty: 'Medium', topic: 'Matrix' },
  ]

  const sheetProblems = allProblems.filter(p => p.sheetId === sheetId);

  useEffect(() => {
    const fetchSolved = async () => {
        try {
            const solvedIds = await getSolvedProblems();
            if (solvedIds) setSolvedProblems(new Set(solvedIds));
        } catch (error) { console.error("Failed to fetch solved problems", error); }
    }
    if (user) fetchSolved();
  }, [user]);

  const solvedInThisSheet = sheetProblems.filter(p => solvedProblems.has(p.id)).length;
  const totalInThisSheet = sheetProblems.length;
  const progressPercentage = totalInThisSheet > 0 ? Math.round((solvedInThisSheet / totalInThisSheet) * 100) : 0;

  const topics = ['all', ...new Set(sheetProblems.map(p => p.topic))]
  const difficulties = ['all', 'Easy', 'Medium', 'Hard']
  const statuses = ['all', 'solved', 'unsolved']

  const filteredProblems = sheetProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopic === 'all' || problem.topic === selectedTopic
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty
    const isSolved = solvedProblems.has(problem.id)
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'solved' && isSolved) ||
                         (selectedStatus === 'unsolved' && !isSolved)
    return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-6"><Link to="/sheets"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Sheets</Link></Button>
        <Card className="overflow-hidden mb-8">
          <div className={`${currentSheet.color} px-8 py-12 text-white`}>
            <h1 className="text-4xl font-bold mb-2">{currentSheet.name}</h1>
            <p className="text-xl opacity-90 mb-4">by {currentSheet.author}</p>
            <p className="text-lg opacity-80 max-w-3xl">{currentSheet.description}</p>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center"><div className="text-3xl font-bold text-primary mb-1">{solvedInThisSheet}/{totalInThisSheet}</div><div className="text-muted-foreground">Problems Solved</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-green-600 mb-1">{progressPercentage}%</div><div className="text-muted-foreground">Completion</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-purple-600 mb-1">#8</div><div className="text-muted-foreground">College Rank</div></div>
            </div>
            <div className="mt-6"><div className="flex justify-between text-sm text-muted-foreground mb-2"><span>Overall Progress</span><span>{solvedInThisSheet}/{totalInThisSheet}</span></div><Progress value={progressPercentage} className="h-3" /></div>
          </CardContent>
        </Card>
        {/* Filters and List UI remains same, standard card rendering */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input type="text" placeholder="Search problems..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
              <select className="px-4 py-2 border border-input rounded-md bg-background" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>{topics.map(topic => <option key={topic} value={topic}>{topic === 'all' ? 'All Topics' : topic}</option>)}</select>
              <select className="px-4 py-2 border border-input rounded-md bg-background" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>{difficulties.map(difficulty => <option key={difficulty} value={difficulty}>{difficulty === 'all' ? 'All Difficulties' : difficulty}</option>)}</select>
              <select className="px-4 py-2 border border-input rounded-md bg-background" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>{statuses.map(status => <option key={status} value={status}>{status === 'all' ? 'All Problems' : status === 'solved' ? 'Solved' : 'Unsolved'}</option>)}</select>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full"><thead className="bg-muted/50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Problem</th><th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Topic</th><th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Difficulty</th><th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Links</th></tr></thead><tbody className="bg-card divide-y divide-border">{filteredProblems.map((problem) => (<tr key={problem.id} className="hover:bg-muted/50"><td className="px-6 py-4 whitespace-nowrap"><Button variant="ghost" size="icon" className="cursor-default hover:bg-transparent">{solvedProblems.has(problem.id) ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}</Button></td><td className="px-6 py-4"><div><div className="font-medium text-foreground">{problem.title}</div></div></td><td className="px-6 py-4 whitespace-nowrap"><Badge variant="secondary">{problem.topic}</Badge></td><td className="px-6 py-4 whitespace-nowrap"><Badge variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'}>{problem.difficulty}</Badge></td><td className="px-6 py-4 whitespace-nowrap"><div className="flex space-x-2"><Button variant="outline" size="sm" asChild className="ml-2"><Link to={`/problem/${problem.id}`}><Play className="h-4 w-4 mr-1" /> Solve</Link></Button></div></td></tr>))}</tbody></table></div>
        </Card>
      </div>
    </div>
  )
}

export default SheetDetail