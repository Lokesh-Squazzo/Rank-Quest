import { useState, useEffect, useMemo } from 'react'
import { Brain, TrendingUp, Star, Clock, Target, Zap, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { problems, getTopicStats } from '../../data/problems'

const SHEET_NAMES = {
  'striver-sde': 'Striver SDE Sheet',
  'love-babbar-450': 'Love Babbar 450',
  'neetcode-150': 'NeetCode 150',
  'blind-75': 'Blind 75',
  'gfg-must-do': 'GFG Must Do',
  'apna-college': 'Apna College Sheet'
}

const ProblemRecommendations = ({ userStats = {}, solvedProblems = new Set(), currentSheet = null }) => {
  const [mounted, setMounted] = useState(false)
  const [recommendationType, setRecommendationType] = useState('smart') // 'smart' | 'sheet' | 'popular' | 'hard'

  useEffect(() => {
    setMounted(true)
  }, [])

  const solvedSet = useMemo(() => {
    return solvedProblems instanceof Set ? solvedProblems : new Set(solvedProblems || [])
  }, [solvedProblems])

  // Real unsolved problems from the catalog
  const unsolvedProblems = useMemo(() => {
    return problems.filter(p => !solvedSet.has(p.id))
  }, [solvedSet])

  // Recommendations filtered by algorithm type
  const recommendations = useMemo(() => {
    if (unsolvedProblems.length === 0) {
      // If user solved everything, return all problems as practice review
      return problems.slice(0, 6)
    }

    let list = [...unsolvedProblems]

    switch (recommendationType) {
      case 'sheet': {
        const targetSheet = currentSheet || 'striver-sde'
        const inSheet = list.filter(p => p.sheet === targetSheet)
        return (inSheet.length > 0 ? inSheet : list).slice(0, 6)
      }
      case 'popular': {
        // High frequency interview sheets: NeetCode 150 & Blind 75
        const popular = list.filter(p => p.sheet === 'neetcode-150' || p.sheet === 'blind-75')
        return (popular.length > 0 ? popular : list).slice(0, 6)
      }
      case 'hard': {
        // Prioritize Medium and Hard problems
        const hardList = list.filter(p => p.difficulty === 'Medium' || p.difficulty === 'Hard')
        return (hardList.length > 0 ? hardList : list).slice(0, 6)
      }
      case 'smart':
      default: {
        // Balance: next available Easy first, then Medium, prioritizing Striver and NeetCode
        const sorted = [...list].sort((a, b) => {
          const diffRank = { Easy: 1, Medium: 2, Hard: 3 }
          return (diffRank[a.difficulty] || 2) - (diffRank[b.difficulty] || 2)
        })
        return sorted.slice(0, 6)
      }
    }
  }, [unsolvedProblems, recommendationType, currentSheet])

  // Topic mastery stats for AI Insights
  const topicStats = useMemo(() => {
    return getTopicStats(Array.from(solvedSet))
  }, [solvedSet])

  const topSolvedTopic = useMemo(() => {
    const sorted = [...topicStats].sort((a, b) => b.solved - a.solved)
    return sorted[0]?.solved > 0 ? sorted[0] : null
  }, [topicStats])

  const focusTopic = useMemo(() => {
    const unmastered = topicStats.filter(t => t.solved < t.total)
    return unmastered[0] || null
  }, [topicStats])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getEstimatedMinutes = (difficulty) => {
    if (difficulty === 'Easy') return 15
    if (difficulty === 'Medium') return 25
    return 45
  }

  const getSuccessRate = (difficulty) => {
    if (difficulty === 'Easy') return '76%'
    if (difficulty === 'Medium') return '52%'
    return '38%'
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header and Filter Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> Smart Problem Recommender
          </h2>
          <p className="text-xs text-muted-foreground">
            Curated next steps based on your active sheets and unsolved DSA patterns
          </p>
        </div>

        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { id: 'smart', label: 'Adaptive', icon: Zap },
            { id: 'popular', label: 'FAANG Top', icon: Star },
            { id: 'sheet', label: 'Sheet Next', icon: BookOpen },
            { id: 'hard', label: 'Challenger', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setRecommendationType(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium flex items-center space-x-1.5 ${
                  recommendationType === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-white/10 text-muted-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recommendation Grid */}
      {recommendations.length === 0 ? (
        <Card className="glass-dark border-0 p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold">Incredible! All Problems Solved</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            You have mastered every problem currently in the RankQuest curriculum.
          </p>
          <Button asChild>
            <Link to="/sheets">Review Sheets</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((problem) => (
            <Card 
              key={problem.id}
              className="glass-dark border-0 shadow-lg hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className={`${getDifficultyColor(problem.difficulty)} text-xs font-semibold`}>
                      {problem.difficulty}
                    </Badge>
                    <span className="text-[11px] font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      {SHEET_NAMES[problem.sheet] || problem.sheet}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {problem.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Topic: <span className="text-foreground font-medium">{problem.topic || 'General DSA'}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-white/5 rounded-xl text-center mb-4 border border-white/5 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Est. Time</span>
                      <span className="font-semibold">{getEstimatedMinutes(problem.difficulty)}m</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Pass Rate</span>
                      <span className="font-semibold text-emerald-400">{getSuccessRate(problem.difficulty)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Sheet ID</span>
                      <span className="font-semibold text-primary">#{problem.id}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(problem.tags || []).slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-md border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link */}
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold h-9 shadow-md shadow-primary/20">
                  <Link to={`/problem/${problem.id}`}>
                    Solve Problem <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dynamic AI Insights */}
      <Card className="glass-dark border-0 shadow-xl bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="flex items-center space-x-2 text-base">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white">
              <Brain className="h-4 w-4" />
            </div>
            <span>Curated Algorithmic Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-emerald-400 font-semibold text-xs">
                <TrendingUp className="h-4 w-4" /> Strongest Topic
              </div>
              <p className="text-xs text-muted-foreground">
                {topSolvedTopic 
                  ? `You have solved ${topSolvedTopic.solved} problems in ${topSolvedTopic.topic}. Keep building on this strength!`
                  : "Solve your first array or string problem to establish your strengths."}
              </p>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-amber-400 font-semibold text-xs">
                <Target className="h-4 w-4" /> Next Milestone
              </div>
              <p className="text-xs text-muted-foreground">
                {focusTopic
                  ? `Target ${focusTopic.topic} (${focusTopic.solved}/${focusTopic.total} solved) to maintain balanced DSA mastery.`
                  : "Explore Striver SDE and NeetCode 150 sheets for advanced algorithms."}
              </p>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-blue-400 font-semibold text-xs">
                <Star className="h-4 w-4" /> Interview Target
              </div>
              <p className="text-xs text-muted-foreground">
                Aim to solve at least 2 Medium problems daily to match top product-based company interview criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProblemRecommendations
