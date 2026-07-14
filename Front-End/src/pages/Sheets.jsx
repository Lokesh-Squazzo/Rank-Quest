import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// FIX: Added 'Target' to the imports
import { Code, Users, Star, Filter, Search, BookOpen, TrendingUp, ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { getSolvedProblems } from '../services/apiService'
import { useAuth } from '../contexts/AuthContext'

const Sheets = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mounted, setMounted] = useState(false)
  
  const [solvedSet, setSolvedSet] = useState(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        try {
          const solvedIds = await getSolvedProblems();
          if (solvedIds) {
            setSolvedSet(new Set(solvedIds));
          }
        } catch (error) {
          console.error("Failed to fetch progress:", error);
        }
      }
    }
    fetchProgress();
  }, [user]);

  const sheetProblemMapping = {
      'striver-sde': [1, 2, 3, 4, 5],
      'love-babbar-450': [6, 7, 8, 9, 10],
      'neetcode-150': [11, 12, 13, 14, 15],
      'blind-75': [16, 17, 18, 19, 20],
      'gfg-must-do': [21, 22, 23, 24, 25],
      'apna-college': [26, 27, 28, 29, 30]
  };

  const getSolvedCount = (sheetId) => {
      const ids = sheetProblemMapping[sheetId] || [];
      return ids.filter(id => solvedSet.has(id)).length;
  };

  const sheets = [
    {
      id: 'striver-sde',
      name: 'Striver SDE Sheet',
      author: 'Raj Vikramaditya',
      description: 'The ultimate roadmap for SDE roles. Covers every major topic needed for top-tier interviews.',
      totalProblems: 5,
      solvedProblems: getSolvedCount('striver-sde'),
      difficulty: 'Hard',
      category: 'Interview Prep',
      rating: 4.9,
      users: '15k+',
      color: 'from-blue-600 to-indigo-600',
      shadow: 'group-hover:shadow-blue-500/20',
      icon: Code,
      topics: ['Arrays', 'DP', 'Graphs']
    },
    {
      id: 'love-babbar-450',
      name: 'Love Babbar 450',
      author: 'Love Babbar',
      description: 'A comprehensive list of 450 problems to build a rock-solid foundation in DSA.',
      totalProblems: 5,
      solvedProblems: getSolvedCount('love-babbar-450'),
      difficulty: 'Mixed',
      category: 'Complete DSA',
      rating: 4.8,
      users: '12k+',
      color: 'from-violet-600 to-purple-600',
      shadow: 'group-hover:shadow-purple-500/20',
      icon: Sparkles,
      topics: ['Strings', 'Trees', 'Logic']
    },
    {
      id: 'neetcode-150',
      name: 'NeetCode 150',
      author: 'NeetCode',
      description: 'Highly curated list focusing on patterns. The most efficient way to learn.',
      totalProblems: 5,
      solvedProblems: getSolvedCount('neetcode-150'),
      difficulty: 'Medium',
      category: 'LeetCode',
      rating: 4.7,
      users: '9k+',
      color: 'from-emerald-500 to-teal-600',
      shadow: 'group-hover:shadow-emerald-500/20',
      icon: Zap,
      topics: ['Sliding Window', '2 Pointers']
    },
    {
      id: 'blind-75',
      name: 'Blind 75',
      author: 'Blind Community',
      description: 'The legendary list. 75 most asked questions at FAANG companies.',
      totalProblems: 5,
      solvedProblems: getSolvedCount('blind-75'),
      difficulty: 'Hard',
      category: 'FAANG Prep',
      rating: 4.9,
      users: '18k+',
      color: 'from-red-500 to-orange-600',
      shadow: 'group-hover:shadow-red-500/20',
      icon: Target,
      topics: ['Classic', 'Must Do']
    },
    {
      id: 'gfg-must-do',
      name: 'GFG Must Do',
      author: 'GeeksforGeeks',
      description: 'Essential problems for campus placements and service-based companies.',
      totalProblems: 5,
      solvedProblems: getSolvedCount('gfg-must-do'),
      difficulty: 'Easy',
      category: 'Placement',
      rating: 4.6,
      users: '10k+',
      color: 'from-green-600 to-emerald-700',
      shadow: 'group-hover:shadow-green-500/20',
      icon: BookOpen,
      topics: ['Placement', 'Basics']
    },
    {
      id: 'apna-college',
      name: 'Apna College',
      author: 'Shradha Khapra',
      description: 'Beginner friendly sheet with excellent explanations for every problem.',
      totalProblems: 5,
      solvedProblems: getSolvedCount('apna-college'),
      difficulty: 'Easy',
      category: 'Beginner',
      rating: 4.5,
      users: '8k+',
      color: 'from-cyan-500 to-blue-500',
      shadow: 'group-hover:shadow-cyan-500/20',
      icon: Star,
      topics: ['Basics', 'Sorting']
    }
  ]

  const categories = ['all', 'Interview Prep', 'Complete DSA', 'LeetCode', 'FAANG Prep', 'Placement', 'Beginner']
  const difficulties = ['all', 'Easy', 'Medium', 'Hard', 'Mixed']

  const filteredSheets = sheets.filter(sheet => {
    const matchesSearch = sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || sheet.difficulty === selectedDifficulty
    const matchesCategory = selectedCategory === 'all' || sheet.category === selectedCategory
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          
          <div className={`text-center mb-16 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Curated by Experts</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Master Data Structures <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                & Algorithms
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose your path to mastery with our hand-picked problem sheets. 
              Track your progress and crack your dream company.
            </p>
          </div>

          <div className={`max-w-5xl mx-auto mb-12 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="p-2 bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search sheets..."
                  className="pl-12 h-12 bg-transparent border-transparent focus:bg-background/50 rounded-xl text-lg transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 px-2">
                 <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select 
                      className="h-12 pl-10 pr-8 bg-muted/50 hover:bg-muted border-transparent rounded-xl appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm min-w-[140px]"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                    </select>
                 </div>
                 <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                     <select 
                      className="h-12 pl-10 pr-8 bg-muted/50 hover:bg-muted border-transparent rounded-xl appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm min-w-[140px]"
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                      {difficulties.map(d => <option key={d} value={d}>{d === 'all' ? 'All Difficulties' : d}</option>)}
                    </select>
                 </div>
              </div>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${mounted ? 'animate-stagger-in' : 'opacity-0'}`}>
            {filteredSheets.map((sheet) => {
               const progress = (sheet.solvedProblems / sheet.totalProblems) * 100;
               return (
              <Link key={sheet.id} to={`/sheets/${sheet.id}`} className="group block h-full">
                <Card className={`h-full border-0 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:-translate-y-1 shadow-lg ${sheet.shadow} overflow-hidden flex flex-col`}>
                  
                  <div className={`h-2 w-full bg-gradient-to-r ${sheet.color}`}></div>
                  
                  <CardHeader className="pb-4 relative">
                    <div className="flex justify-between items-start mb-2">
                       <div className={`p-3 rounded-2xl bg-gradient-to-br ${sheet.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <sheet.icon className="h-6 w-6" />
                       </div>
                       {progress > 0 && (
                         <Badge className="bg-primary/10 text-primary border-primary/20">
                           {progress === 100 ? 'Completed' : 'In Progress'}
                         </Badge>
                       )}
                    </div>
                    
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {sheet.name}
                    </CardTitle>
                    <div className="text-sm font-medium text-muted-foreground mt-1">
                      by <span className="text-foreground">{sheet.author}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col gap-6">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {sheet.description}
                    </p>

                    <div className="mt-auto space-y-3">
                       <div className="flex justify-between text-sm font-medium">
                          <span className="text-muted-foreground">Progress</span>
                          <span className={progress === 100 ? "text-green-500" : "text-foreground"}>
                            {Math.round(progress)}%
                          </span>
                       </div>
                       <Progress value={progress} className="h-2" indicatorClassName={`bg-gradient-to-r ${sheet.color}`} />
                       <div className="flex justify-between text-xs text-muted-foreground pt-1">
                          <span>{sheet.solvedProblems} / {sheet.totalProblems} Solved</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                       <div className="flex gap-3">
                          <div className="flex items-center gap-1 text-yellow-500 font-medium">
                             <Star className="w-3.5 h-3.5 fill-current" /> {sheet.rating}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                             <Users className="w-3.5 h-3.5" /> {sheet.users}
                          </div>
                       </div>
                       
                       <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
                          Start Now <ArrowRight className="w-3 h-3" />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )})}
          </div>

          {filteredSheets.length === 0 && (
            <div className="text-center py-20">
              <div className="p-6 bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No sheets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchTerm(''); setSelectedCategory('all'); setSelectedDifficulty('all')}}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sheets