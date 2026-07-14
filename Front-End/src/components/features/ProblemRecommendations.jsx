import { useState, useEffect } from 'react'
import { Brain, TrendingUp, Star, Clock, Target, Zap, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const ProblemRecommendations = ({ userStats, solvedProblems = new Set(), currentSheet = null }) => {
  const [mounted, setMounted] = useState(false)
  const [recommendationType, setRecommendationType] = useState('smart') // smart, weak-topics, trending, similar
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Advanced recommendation algorithm
  const getRecommendations = () => {
    const mockProblems = [
      {
        id: 'two-sum-variant',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'Medium',
        topic: 'Arrays',
        estimatedTime: 15,
        successRate: 68,
        tags: ['Two Pointers', 'Arrays', 'Binary Search'],
        reason: 'Based on your recent array problem solving pattern',
        priority: 'high',
        similarTo: 'Two Sum',
        sheet: 'LeetCode Top 150'
      },
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        topic: 'Stacks',
        estimatedTime: 10,
        successRate: 82,
        tags: ['Stack', 'String'],
        reason: 'Strengthen your stack fundamentals',
        priority: 'medium',
        sheet: 'Blind 75'
      },
      {
        id: 'binary-tree-inorder',
        title: 'Binary Tree Inorder Traversal',
        difficulty: 'Easy',
        topic: 'Trees',
        estimatedTime: 12,
        successRate: 75,
        tags: ['Tree', 'DFS', 'Recursion'],
        reason: 'You haven\'t solved tree problems recently',
        priority: 'high',
        sheet: 'Striver SDE'
      },
      {
        id: 'longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        topic: 'Strings',
        estimatedTime: 25,
        successRate: 45,
        tags: ['Sliding Window', 'Hash Table', 'String'],
        reason: 'Popular problem with 89% interview frequency',
        priority: 'high',
        trending: true,
        sheet: 'NeetCode 150'
      },
      {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        topic: 'Arrays',
        estimatedTime: 20,
        successRate: 52,
        tags: ['Arrays', 'Sorting'],
        reason: 'Commonly asked in FAANG interviews',
        priority: 'medium',
        sheet: 'Blind 75'
      }
    ]

    // Filter based on recommendation type
    switch (recommendationType) {
      case 'weak-topics':
        return mockProblems.filter(p => ['Trees', 'Graphs'].includes(p.topic))
      case 'trending':
        return mockProblems.filter(p => p.trending || p.successRate < 60)
      case 'similar':
        return mockProblems.filter(p => p.similarTo)
      default:
        return mockProblems
    }
  }

  const recommendations = getRecommendations()

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'smart': return <Brain className="h-4 w-4" />
      case 'weak-topics': return <Target className="h-4 w-4" />
      case 'trending': return <TrendingUp className="h-4 w-4" />
      case 'similar': return <BookOpen className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header with Type Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Recommended Problems
        </h2>
        <div className="flex bg-background/30 border border-white/20 rounded-xl p-1">
          {[
            { key: 'smart', label: 'Smart', icon: <Brain className="h-4 w-4" /> },
            { key: 'weak-topics', label: 'Weak Topics', icon: <Target className="h-4 w-4" /> },
            { key: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
            { key: 'similar', label: 'Similar', icon: <BookOpen className="h-4 w-4" /> }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setRecommendationType(type.key)}
              className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center space-x-2 ${
                recommendationType === type.key
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((problem, index) => (
          <Card key={problem.id} className="glass-dark border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 group">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <Badge className={`${getPriorityColor(problem.priority)} px-2 py-1 text-xs`}>
                    {problem.priority} priority
                  </Badge>
                </div>
                <Badge className={`${getDifficultyColor(problem.difficulty)} px-3 py-1`}>
                  {problem.difficulty}
                </Badge>
              </div>

              {/* Title and Topic */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gradient group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground/80 mb-3">{problem.topic} • {problem.sheet}</p>

              {/* Reason */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-primary font-medium">{problem.reason}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">{problem.estimatedTime}m</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Est. Time</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">{problem.successRate}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Success Rate</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Zap className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Rank</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} className="bg-muted/50 text-muted-foreground border-muted text-xs px-2 py-1">
                    {tag}
                  </Badge>
                ))}
                {problem.tags.length > 3 && (
                  <Badge className="bg-muted/50 text-muted-foreground border-muted text-xs px-2 py-1">
                    +{problem.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Action Button */}
              <Button asChild className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-xl">
                <Link to={`/problem/${problem.id}`}>
                  Start Solving
                  <Zap className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="glass-dark border-0 shadow-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl">AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-background/20 border border-white/10 rounded-xl">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Strength: Array Problems</h4>
                <p className="text-sm text-muted-foreground">You've solved 85% of array problems with high accuracy. Consider tackling advanced array algorithms.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-background/20 border border-white/10 rounded-xl">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Target className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Focus Area: Tree Algorithms</h4>
                <p className="text-sm text-muted-foreground">Your tree problem success rate is 45%. Focus on DFS/BFS patterns to improve.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-background/20 border border-white/10 rounded-xl">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Star className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Interview Ready Topics</h4>
                <p className="text-sm text-muted-foreground">Arrays, Strings, and Hash Tables. You're ready for interviews in these areas!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProblemRecommendations
