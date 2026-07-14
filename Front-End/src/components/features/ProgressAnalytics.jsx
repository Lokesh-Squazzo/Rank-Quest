import { useState, useEffect } from 'react'
import { TrendingUp, Target, Calendar, Award, BarChart3, PieChart, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'

const ProgressAnalytics = ({ userStats, solvedProblems = new Set() }) => {
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState('week') // week, month, year
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock analytics data - in real app, this would come from backend
  const analyticsData = {
    week: {
      problemsSolved: 12,
      timeSpent: 18.5, // hours
      streakDays: 5,
      averageTime: 92, // minutes per problem
      topicProgress: [
        { topic: 'Arrays', solved: 8, total: 15, percentage: 53 },
        { topic: 'Strings', solved: 4, total: 10, percentage: 40 },
        { topic: 'Trees', solved: 3, total: 12, percentage: 25 },
        { topic: 'Graphs', solved: 2, total: 8, percentage: 25 }
      ],
      difficultyBreakdown: {
        easy: { solved: 6, attempted: 8 },
        medium: { solved: 4, attempted: 7 },
        hard: { solved: 2, attempted: 5 }
      },
      dailyActivity: [
        { day: 'Mon', problems: 2, time: 3.2 },
        { day: 'Tue', problems: 3, time: 4.1 },
        { day: 'Wed', problems: 1, time: 1.8 },
        { day: 'Thu', problems: 2, time: 2.9 },
        { day: 'Fri', problems: 3, time: 4.2 },
        { day: 'Sat', problems: 1, time: 2.3 },
        { day: 'Sun', problems: 0, time: 0 }
      ]
    }
  }

  const currentData = analyticsData[timeRange]

  const getStreakColor = (days) => {
    if (days >= 30) return 'text-purple-400'
    if (days >= 14) return 'text-blue-400'
    if (days >= 7) return 'text-green-400'
    return 'text-yellow-400'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Progress Analytics
        </h2>
        <div className="flex bg-background/30 border border-white/20 rounded-xl p-1">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                timeRange === range
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-dark border-0 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit mx-auto mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              {currentData.problemsSolved}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Problems Solved</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-0 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit mx-auto mb-4">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {currentData.timeSpent}h
            </div>
            <div className="text-sm text-muted-foreground mt-1">Time Spent</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-0 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl w-fit mx-auto mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className={`text-3xl font-bold ${getStreakColor(currentData.streakDays)}`}>
              {currentData.streakDays}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-0 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl w-fit mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              {currentData.averageTime}m
            </div>
            <div className="text-sm text-muted-foreground mt-1">Avg Time/Problem</div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Progress */}
      <Card className="glass-dark border-0 shadow-2xl">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl">Topic Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {currentData.topicProgress.map((topic, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{topic.topic}</span>
                <span className="text-sm text-muted-foreground">
                  {topic.solved}/{topic.total} ({topic.percentage}%)
                </span>
              </div>
              <div className="relative">
                <Progress value={topic.percentage} className="h-3 bg-background/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty Breakdown & Daily Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Breakdown */}
        <Card className="glass-dark border-0 shadow-2xl">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl">Difficulty Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {Object.entries(currentData.difficultyBreakdown).map(([difficulty, data]) => (
              <div key={difficulty} className="flex items-center justify-between p-4 bg-background/30 border border-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Badge className={`${getDifficultyColor(difficulty)} px-3 py-1 capitalize`}>
                    {difficulty}
                  </Badge>
                  <span className="font-medium">{data.solved} solved</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.attempted} attempted ({Math.round((data.solved / data.attempted) * 100)}% success)
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card className="glass-dark border-0 shadow-2xl">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl">Daily Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {currentData.dailyActivity.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/20 border border-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium w-8">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        day.problems > 0 ? 'bg-emerald-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-sm">{day.problems} problems</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.time}h
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProgressAnalytics
