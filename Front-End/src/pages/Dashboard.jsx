import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Zap, Target, Trophy, Flame, ArrowRight, 
  Activity, Calendar, BookOpen, Star, ChevronRight, Sparkles, Users,
  BarChart3, Brain, Medal, LayoutDashboard, CheckCircle2
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge' 
import { useAuth } from '../contexts/AuthContext'
import { getSolvedProblems, getMySubmissionHistory } from '../services/apiService'
import { getDifficultyStats, problems } from '../data/problems' 
import GamificationSystem from '../components/features/GamificationSystem'
import ProgressAnalytics from '../components/features/ProgressAnalytics'
import ProblemRecommendations from '../components/features/ProblemRecommendations'

const Dashboard = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'analytics' | 'recommendations' | 'achievements'
  
  const [stats, setStats] = useState({ Easy: 0, Medium: 0, Hard: 0, Total: 0 })
  const [solvedSet, setSolvedSet] = useState(new Set())
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const solvedIds = await getSolvedProblems()
          if (solvedIds) {
            setSolvedSet(new Set(solvedIds))
            const calculatedStats = getDifficultyStats(solvedIds)
            setStats(calculatedStats)
          }
        } catch (error) {
          console.error("Failed to fetch solved problems", error)
        }

        try {
          const subRes = await getMySubmissionHistory()
          const subList = Array.isArray(subRes) ? subRes : subRes?.data || []
          setSubmissions(subList)
        } catch (error) {
          console.warn("Could not load submission history", error)
        }
      }
    }
    if (user) fetchUserData()
  }, [user])

  const LandingView = () => (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden selection:bg-purple-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] opacity-50 animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className={`relative z-10 max-w-5xl px-6 text-center space-y-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            The #1 Platform for DSA Mastery
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
          Code Your Way <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            To The Top.
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          RankQuest gives you the structured roadmap you need. Solve curated problems, track your stats, and compete on the global leaderboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to="/login">
            <Button size="lg" className="h-14 px-8 text-lg border-0 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-full font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              Start Solving Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/sheets">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50 rounded-full font-medium backdrop-blur-sm transition-all">
              Explore Sheets
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="ghost" className="h-14 px-6 text-base text-gray-300 hover:text-white hover:bg-white/10 border border-white/15 rounded-full font-medium transition-all gap-2">
              <Users className="w-5 h-5 text-primary" /> Meet Developers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  const UserDashboardView = () => {
    const rankLevel = Math.floor(stats.Total / 5) + 1

    // Real 14-day activity derived from user submissions
    const activityDays = useMemo(() => {
      const result = []
      const today = new Date()
      for (let i = 13; i >= 0; i--) {
        const d = new Date()
        d.setDate(today.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const count = submissions.filter(s => s.submittedAt && s.submittedAt.startsWith(dateStr)).length
        result.push({
          day: i,
          date: dateStr,
          count,
          active: count > 0,
          height: Math.min(count * 25 + 15, 100)
        })
      }
      return result
    }, [submissions])

    // Top 3 unsolved recommendations for quick overview preview
    const quickRecommendations = useMemo(() => {
      return problems.filter(p => !solvedSet.has(p.id)).slice(0, 3)
    }, [solvedSet])

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{user?.name || user?.username || "Developer"}</span> 👋
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              You've solved <span className="text-primary font-bold">{stats.Total}</span> of 30 problems. Keep pushing for your next badge!
            </p>
          </div>
          <div className="flex gap-2.5">
             <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => navigate('/sheets')}>
               <BookOpen className="w-4 h-4" /> Browse Sheets
             </Button>
             <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-xs" onClick={() => navigate('/problem/1')}>
               <Zap className="w-4 h-4" /> Quick Solve
             </Button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
            { id: 'recommendations', label: 'Smart Recommendations', icon: Brain },
            { id: 'achievements', label: 'Badges & Milestones', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Easy Solved" value={stats.Easy} icon={Zap} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-400/20" />
              <StatsCard title="Medium Solved" value={stats.Medium} icon={Target} color="text-yellow-400" bg="bg-yellow-400/10" border="border-yellow-400/20" />
              <StatsCard title="Hard Solved" value={stats.Hard} icon={Flame} color="text-red-400" bg="bg-red-400/10" border="border-red-400/20" />
              <StatsCard title="Current Level" value={`Lvl ${rankLevel}`} subValue={`${user?.totalScore || stats.Total * 10} XP`} icon={Trophy} color="text-purple-400" bg="bg-purple-400/10" border="border-purple-400/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                {/* 14-Day Activity Heatmap Bar */}
                <Card className="glass-dark border-0 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-400" /> 
                        <span>14-Day Activity Heatmap</span>
                      </div>
                      <Badge variant="outline" className="text-[11px] text-muted-foreground">
                        {submissions.length} Total Submissions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between h-28 gap-2 pt-4 px-1">
                      {activityDays.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1.5 group relative">
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-black/90 border border-white/10 text-[10px] text-white px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                            {day.date}: {day.count} {day.count === 1 ? 'submission' : 'submissions'}
                          </div>
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              day.active 
                                ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                                : 'bg-white/5 group-hover:bg-white/10'
                            }`} 
                            style={{ height: `${day.active ? day.height : 10}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 px-1">
                      <span>2 Weeks Ago</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Day
                      </span>
                      <span>Today</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Goal */}
                <Card className="glass-dark border-0 shadow-xl overflow-hidden relative group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="w-5 h-5 text-blue-400" /> Active Sheet Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-base text-foreground">Striver SDE Sheet</h3>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Primary Focus</Badge>
                        </div>
                        <Progress value={Math.min((stats.Total / 5) * 100, 100)} className="h-2 mb-2" />
                        <p className="text-xs text-muted-foreground">{Math.min(stats.Total, 5)} / 5 Sheet Problems Solved</p>
                      </div>
                      <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs" onClick={() => navigate('/sheets/striver-sde')}>
                        Continue Sheet <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column: Quick Recommender Preview */}
              <div className="space-y-6">
                <Card className="glass-dark border-0 shadow-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Brain className="w-4 h-4 text-primary" /> Next Up
                      </CardTitle>
                      <button 
                        onClick={() => setActiveTab('recommendations')}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        View All
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickRecommendations.map((problem) => (
                      <div 
                        key={problem.id} 
                        className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                        onClick={() => navigate(`/problem/${problem.id}`)}
                      >
                        <div>
                          <div className="font-semibold text-xs group-hover:text-primary transition-colors">
                            {problem.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span className={problem.difficulty === 'Easy' ? 'text-emerald-400' : 'text-amber-400'}>
                              {problem.difficulty}
                            </span>
                            <span>•</span>
                            <span>{problem.topic || 'DSA'}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs group-hover:text-primary">
                          Solve <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Pro Tip Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-300" /> Consistency Multiplier
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      Maintaining a 7-day streak boosts your leaderboard ranking and unlocks the <span className="font-semibold text-white">Consistent Coder</span> badge.
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-xs backdrop-blur-sm"
                      onClick={() => setActiveTab('achievements')}
                    >
                      View All Badges
                    </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROGRESS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <ProgressAnalytics 
              userStats={stats} 
              solvedProblems={solvedSet} 
              submissions={submissions} 
            />
          </div>
        )}

        {/* TAB 3: SMART RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="animate-fade-in">
            <ProblemRecommendations 
              userStats={stats} 
              solvedProblems={solvedSet} 
              currentSheet="striver-sde" 
            />
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS & BADGES */}
        {activeTab === 'achievements' && (
          <div className="animate-fade-in">
            <GamificationSystem 
              userStats={stats} 
              solvedProblems={solvedSet} 
              user={user} 
            />
          </div>
        )}

      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {user && <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 via-background to-background"></div>}
      <div className="relative z-10 pt-16">
        {user ? <UserDashboardView /> : <LandingView />}
      </div>
    </div>
  )
}

const StatsCard = ({ title, value, subValue, icon: Icon, color, bg, border }) => (
  <Card className={`glass-dark border-0 shadow-lg relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500`}><Icon className={`w-10 h-10 ${color}`} /></div>
    <CardContent className="p-5">
      <div className={`w-9 h-9 rounded-lg ${bg} ${border} border flex items-center justify-center mb-3`}><Icon className={`w-4 h-4 ${color}`} /></div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-foreground">{value}</h2>
          {subValue && <span className="text-[11px] text-muted-foreground font-mono">{subValue}</span>}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default Dashboard