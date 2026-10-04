import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, Target, Calendar, Award, BarChart3, PieChart, Activity, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { getTopicStats, problems } from '../../data/problems'

const ProgressAnalytics = ({ userStats = {}, solvedProblems = new Set(), submissions = [] }) => {
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState('all') // 'week' | 'month' | 'all'

  useEffect(() => {
    setMounted(true)
  }, [])

  const solvedSet = useMemo(() => {
    return solvedProblems instanceof Set ? solvedProblems : new Set(solvedProblems || [])
  }, [solvedProblems])

  const total = userStats?.Total || 0
  const easy = userStats?.Easy || 0
  const medium = userStats?.Medium || 0
  const hard = userStats?.Hard || 0

  // Problem counts per difficulty in the catalog
  const totalEasyInCatalog = useMemo(() => problems.filter(p => p.difficulty === 'Easy').length, [])
  const totalMediumInCatalog = useMemo(() => problems.filter(p => p.difficulty === 'Medium').length, [])
  const totalHardInCatalog = useMemo(() => problems.filter(p => p.difficulty === 'Hard').length, [])

  // Dynamic real topic breakdown
  const topicProgress = useMemo(() => {
    const list = getTopicStats(Array.from(solvedSet))
    return list.length > 0 ? list : [
      { topic: 'Arrays', solved: 0, total: 12, percentage: 0 },
      { topic: 'Strings', solved: 0, total: 3, percentage: 0 },
      { topic: 'Sorting', solved: 0, total: 4, percentage: 0 },
      { topic: 'Dynamic Programming', solved: 0, total: 2, percentage: 0 }
    ]
  }, [solvedSet])

  // Calculate real daily submission activity for the last 7 days
  const dailyActivity = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const last7Days = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = days[d.getDay()]

      // Filter submissions for this specific date
      const count = submissions.filter(s => {
        if (!s.submittedAt) return false
        const subDate = new Date(s.submittedAt).toISOString().split('T')[0]
        return subDate === dateStr
      }).length

      last7Days.push({
        day: dayName,
        date: dateStr,
        problems: count,
        time: (count * 0.4).toFixed(1)
      })
    }

    return last7Days
  }, [submissions])

  // Calculate current streak in days
  const streakDays = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return total > 0 ? 1 : 0
    }
    const dates = new Set(
      submissions
        .filter(s => s.submittedAt)
        .map(s => new Date(s.submittedAt).toISOString().split('T')[0])
    )
    let streak = 0
    const checkDate = new Date()

    while (true) {
      const str = checkDate.toISOString().split('T')[0]
      if (dates.has(str)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        // Allow streak to count if today is not yet done but yesterday was done
        if (streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1)
          const yesterdayStr = checkDate.toISOString().split('T')[0]
          if (dates.has(yesterdayStr)) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
            continue
          }
        }
        break
      }
    }
    return Math.max(streak, total > 0 ? 1 : 0)
  }, [submissions, total])

  const timeSpentHours = (total * 0.45).toFixed(1)
  const avgTimePerProblem = total > 0 ? 25 : 0
  const completionPercentage = Math.round((total / problems.length) * 100)

  const getStreakColor = (days) => {
    if (days >= 30) return 'text-purple-400'
    if (days >= 14) return 'text-blue-400'
    if (days >= 7) return 'text-emerald-400'
    return 'text-amber-400'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Progress & Topic Analytics
          </h2>
          <p className="text-xs text-muted-foreground">Deep dive into your accuracy, problem velocity, and topic mastery</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { id: 'week', label: '7 Days' },
            { id: 'month', label: '30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                timeRange === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-dark border-0 shadow-lg">
          <CardContent className="p-5 text-center">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit mx-auto mb-3 shadow-md shadow-emerald-500/20">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {total} <span className="text-xs text-muted-foreground font-normal">/ {problems.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Problems Solved ({completionPercentage}%)</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-0 shadow-lg">
          <CardContent className="p-5 text-center">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit mx-auto mb-3 shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {timeSpentHours}h
            </div>
            <div className="text-xs text-muted-foreground mt-1">Est. Time Invested</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-0 shadow-lg">
          <CardContent className="p-5 text-center">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl w-fit mx-auto mb-3 shadow-md shadow-orange-500/20">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${getStreakColor(streakDays)}`}>
              {streakDays} {streakDays === 1 ? 'day' : 'days'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Current Momentum</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-0 shadow-lg">
          <CardContent className="p-5 text-center">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl w-fit mx-auto mb-3 shadow-md shadow-purple-500/20">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ~{avgTimePerProblem}m
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg Solve Velocity</div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Mastery Progress */}
      <Card className="glass-dark border-0 shadow-xl">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span>Topic Mastery Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-4">
          {topicProgress.map((topic, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  {topic.topic}
                  {topic.percentage >= 100 && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] py-0 px-1.5">Mastered</Badge>
                  )}
                </span>
                <span className="text-muted-foreground font-mono">
                  {topic.solved} / {topic.total} ({topic.percentage}%)
                </span>
              </div>
              <div className="relative">
                <Progress value={topic.percentage} className="h-2 bg-white/5" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Difficulty Distribution */}
        <Card className="glass-dark border-0 shadow-xl">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
                <PieChart className="h-4 w-4" />
              </div>
              <span>Difficulty Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-3">
            {[
              { level: 'Easy', solved: easy, total: totalEasyInCatalog },
              { level: 'Medium', solved: medium, total: totalMediumInCatalog },
              { level: 'Hard', solved: hard, total: totalHardInCatalog }
            ].map(({ level, solved, total: catalogTotal }) => {
              const pct = catalogTotal > 0 ? Math.round((solved / catalogTotal) * 100) : 0
              return (
                <div key={level} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getDifficultyColor(level)} px-2.5 py-0.5 text-xs font-semibold`}>
                      {level}
                    </Badge>
                    <span className="font-semibold text-sm text-foreground">{solved} Solved</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {solved}/{catalogTotal} ({pct}%)
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* 7-Day Activity Trend */}
        <Card className="glass-dark border-0 shadow-xl">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <span>7-Day Problem Momentum</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <div className="grid grid-cols-7 gap-2">
              {dailyActivity.map((day, index) => {
                const isActive = day.problems > 0
                return (
                  <div key={index} className="flex flex-col items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center">
                    <span className="text-[11px] font-medium text-muted-foreground">{day.day}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive 
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                        : 'bg-white/5 text-muted-foreground/60'
                    }`}>
                      {day.problems}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{day.time}h</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Day
              </span>
              <span>Based on live submission records</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default ProgressAnalytics
