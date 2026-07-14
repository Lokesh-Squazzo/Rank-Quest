import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  User, Mail, Camera, Trophy, Target, Zap, 
  BookOpen, Key, Edit, Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { getSolvedProblems, getGlobalRankings, getCollegeRankings } from '../services/apiService'; // Added ranking APIs
import { getDifficultyStats, problems } from '../data/problems';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ Easy: 0, Medium: 0, Hard: 0, Total: 0 });
  const [sheetsCompleted, setSheetsCompleted] = useState(0);
  
  // New State for Ranks
  const [ranks, setRanks] = useState({ global: '-', college: '-' });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // 1. Fetch Solved Problems & Calculate Stats
          const solvedIds = await getSolvedProblems();
          if (solvedIds) {
            // Difficulty Stats
            const realStats = getDifficultyStats(solvedIds);
            setStats(realStats);

            // Completed Sheets Logic
            const solvedSet = new Set(solvedIds);
            const sheetMap = {};
            problems.forEach(p => {
                if (!sheetMap[p.sheet]) sheetMap[p.sheet] = [];
                sheetMap[p.sheet].push(p.id);
            });

            let completedCount = 0;
            Object.values(sheetMap).forEach(ids => {
                if (ids.length > 0 && ids.every(id => solvedSet.has(id))) {
                    completedCount++;
                }
            });
            setSheetsCompleted(completedCount);
          }

          // 2. Fetch Global Rank
          const globalData = await getGlobalRankings();
          if (globalData) {
             const myRank = globalData.findIndex(u => u.email === user.email) + 1;
             setRanks(prev => ({ ...prev, global: myRank > 0 ? `#${myRank}` : '-' }));
          }

          // 3. Fetch College Rank (only if user has a college)
          if (user.college) {
             const collegeData = await getCollegeRankings(user.college);
             if (collegeData) {
                const myColRank = collegeData.findIndex(u => u.email === user.email) + 1;
                setRanks(prev => ({ ...prev, college: myColRank > 0 ? `#${myColRank}` : '-' }));
             }
          }

        } catch (error) {
          console.error("Failed to load profile data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const userLevel = Math.floor(stats.Total / 5) + 1;

  if (loading) {
      return (
          <div className="min-h-screen bg-background pt-24 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-primary/10 rounded-lg">
             <User className="w-6 h-6 text-primary" />
           </div>
           <div>
             <h1 className="text-3xl font-bold tracking-tight">Profile Dashboard</h1>
             <p className="text-muted-foreground">Manage your account and track your progress</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* 1. User Identity Card */}
            <Card className="glass-dark border-0">
                <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="relative mb-6 group cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[3px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    </div>
                    <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-4 border-background group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-1">{user?.username}</h2>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                    <Mail className="w-3 h-3" /> {user?.email}
                </p>

                <div className="flex gap-2 mb-6">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                    Level {userLevel}
                    </Badge>
                    <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {stats.Total > 0 ? 'Active' : 'Rookie'}
                    </Badge>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6">
                    <div>
                    <p className="text-xs text-muted-foreground mb-1">Roll Number</p>
                    <p className="font-medium">{user?.rollNumber || "-"}</p>
                    </div>
                    <div>
                    <p className="text-xs text-muted-foreground mb-1">College</p>
                    <p className="font-medium truncate" title={user?.college}>{user?.college || "-"}</p>
                    </div>
                    <div>
                    <p className="text-xs text-muted-foreground mb-1">Branch</p>
                    <p className="font-medium">{user?.branch || "-"}</p>
                    </div>
                    <div>
                    <p className="text-xs text-muted-foreground mb-1">Year</p>
                    <p className="font-medium">{user?.year || "-"}</p>
                    </div>
                </div>

                <div className="w-full mt-8 flex gap-3">
                    <Button 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => navigate('/settings', { state: { activeTab: 'profile' } })}
                    >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/settings', { state: { activeTab: 'account' } })}
                    >
                        <Key className="w-4 h-4 mr-2" /> Security
                    </Button>
                </div>
                </CardContent>
            </Card>

            {/* 2. Quick Stats Summary - NOW REAL DYNAMIC DATA */}
            <Card className="glass-dark border-0 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground font-medium">College Rank</span>
                        <Badge className="bg-purple-500/20 text-purple-400 border-0 text-sm px-3">
                            {ranks.college}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground font-medium">Global Rank</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-0 text-sm px-3">
                            {ranks.global}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground font-medium">Current Streak</span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-0 text-sm px-3">
                            {/* Streak requires backend history tracking, using simplified logic for now */}
                            {stats.Total > 0 ? 'Active' : '0 days'}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-muted-foreground font-medium">Sheets Completed</span>
                        <Badge className="bg-green-500/20 text-green-400 border-0 text-sm px-3">
                            {sheetsCompleted}/6
                        </Badge>
                    </div>
                </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Problem Solving Stats */}
            <Card className="glass-dark border-0">
              <CardHeader>
                <CardTitle>Problem Solving Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-3xl font-bold mb-1">{stats.Total}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Solved</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-3xl font-bold text-emerald-500 mb-1">{stats.Easy}</div>
                    <div className="text-xs text-emerald-400/70 uppercase tracking-wider">Easy</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.Medium}</div>
                    <div className="text-xs text-yellow-400/70 uppercase tracking-wider">Medium</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="text-3xl font-bold text-red-500 mb-1">{stats.Hard}</div>
                    <div className="text-xs text-red-400/70 uppercase tracking-wider">Hard</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Achievements */}
            <Card className="glass-dark border-0">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${stats.Total > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className="p-2 bg-amber-500/20 rounded-full text-amber-500">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">First Steps</h4>
                      <p className="text-xs text-muted-foreground">Solved first problem</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${stats.Total >= 10 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className="p-2 bg-blue-500/20 rounded-full text-blue-500">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Dedicated</h4>
                      <p className="text-xs text-muted-foreground">Solved 10 problems</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${stats.Total >= 50 ? 'bg-purple-500/10 border-purple-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className="p-2 bg-purple-500/20 rounded-full text-purple-500">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Master</h4>
                      <p className="text-xs text-muted-foreground">Solved 50 problems</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Recent Activity */}
            <Card className="glass-dark border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.Total === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No activity yet. Start solving problems!
                  </div>
                ) : (
                  <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">Problem Solved</h4>
                          <p className="text-xs text-muted-foreground">You solved a problem recently</p>
                        </div>
                        <div className="text-xs text-muted-foreground">Today</div>
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;