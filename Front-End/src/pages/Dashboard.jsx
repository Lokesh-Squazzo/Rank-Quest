import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Zap, Target, Trophy, Flame, ArrowRight, 
  Activity, Calendar, BookOpen, Star, ChevronRight, Code, Layers, Sparkles 
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge' 
import { useAuth } from '../contexts/AuthContext'
import { getSolvedProblems } from '../services/apiService'
import { getDifficultyStats } from '../data/problems' 

const Dashboard = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  
  const [stats, setStats] = useState({ Easy: 0, Medium: 0, Hard: 0, Total: 0 });

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const solvedIds = await getSolvedProblems();
          if (solvedIds) {
             const calculatedStats = getDifficultyStats(solvedIds);
             setStats(calculatedStats);
          }
        } catch (error) {
          console.error("Failed to fetch stats", error);
        }
      }
    }
    if (user) fetchStats();
  }, [user]);

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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
          <Link to="/login">
            <Button size="lg" className="h-14 px-10 text-lg border-0 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-full font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              Start Solving Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/sheets">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50 rounded-full font-medium backdrop-blur-sm transition-all">
              Explore Sheets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  const UserDashboardView = () => {
    const activityDays = Array.from({ length: 14 }).map((_, i) => ({
      day: i, height: Math.floor(Math.random() * 40) + 10, active: Math.random() > 0.3
    }));

    const rankLevel = Math.floor(stats.Total / 10) + 1;

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            {/* --- FIX IS HERE: Use user?.name OR user?.username --- */}
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{user?.name || user?.username || "Developer"}</span> 👋
            </h1>
            <p className="text-muted-foreground text-lg">You've solved <span className="text-primary font-bold">{stats.Total}</span> problems. Keep pushing!</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2" onClick={() => navigate('/sheets')}><BookOpen className="w-4 h-4" /> Browse Sheets</Button>
             <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => navigate('/problem/1')}><Zap className="w-4 h-4" /> Quick Solve</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard title="Easy Solved" value={stats.Easy} icon={Zap} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-400/20" />
          <StatsCard title="Medium Solved" value={stats.Medium} icon={Target} color="text-yellow-400" bg="bg-yellow-400/10" border="border-yellow-400/20" />
          <StatsCard title="Hard Solved" value={stats.Hard} icon={Flame} color="text-red-400" bg="bg-red-400/10" border="border-red-400/20" />
          <StatsCard title="Current Level" value={`Lvl ${rankLevel}`} subValue={`${stats.Total * 10} XP`} icon={Trophy} color="text-purple-400" bg="bg-purple-400/10" border="border-purple-400/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <Card className="glass-dark border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" /> 
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-end justify-between h-32 gap-2 pt-4 px-2">
                  {activityDays.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${day.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/5'}`} 
                        style={{ height: `${day.active ? day.height + 20 : 10}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1"><span>2 Weeks Ago</span><span>Today</span></div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-0 shadow-xl overflow-hidden relative group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Active Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg text-foreground">Striver SDE Sheet</h3>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Focus</Badge>
                    </div>
                    <Progress value={(stats.Total / 191) * 100} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">{stats.Total} / 191 Problems Solved</p>
                  </div>
                  <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/sheets/striver-sde')}>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            <Card className="glass-dark border-0 shadow-xl">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Star className="w-4 h-4 text-yellow-400" /> Recommended</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[{ name: "Love Babbar 450", id: 'love-babbar-450', diff: "Hard" }, { name: "Blind 75", id: 'blind-75', diff: "Medium" }].map((sheet) => (
                  <div key={sheet.id} className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer" onClick={() => navigate(`/sheets/${sheet.id}`)}>
                    <div><div className="font-medium text-sm group-hover:text-primary transition-colors">{sheet.name}</div><div className="text-xs text-muted-foreground">{sheet.diff}</div></div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h3 className="font-bold text-lg mb-2 relative z-10">Pro Tip 💡</h3>
                <p className="text-sm text-white/80 leading-relaxed relative z-10 mb-4">Consistency is key! Solving just 1 problem a day keeps the streak alive.</p>
                <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm" onClick={() => navigate('/problem/1')}>Solve Daily Challenge</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {user && <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 via-background to-background"></div>}
      <div className="relative z-10">
        {user ? <UserDashboardView /> : <LandingView />}
      </div>
    </div>
  )
}

const StatsCard = ({ title, value, subValue, icon: Icon, color, bg, border }) => (
  <Card className={`glass-dark border-0 shadow-lg relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500`}><Icon className={`w-12 h-12 ${color}`} /></div>
    <CardContent className="p-6">
      <div className={`w-10 h-10 rounded-lg ${bg} ${border} border flex items-center justify-center mb-4`}><Icon className={`w-5 h-5 ${color}`} /></div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2"><h2 className="text-2xl font-bold text-foreground">{value}</h2>{subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}</div>
      </div>
    </CardContent>
  </Card>
)

export default Dashboard