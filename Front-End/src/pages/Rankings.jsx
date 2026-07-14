import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Medal, Award, Crown, Zap, Target, Loader2, AlertCircle, Shield, Star, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { getGlobalRankings, getCollegeRankings } from '../services/apiService'

const Rankings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('global')
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError('');
      try {
        let data = [];
        if (activeTab === 'global') {
            data = await getGlobalRankings();
        } else if (activeTab === 'college') {
            if (user?.college) {
                data = await getCollegeRankings(user.college);
            } else {
                setError("Please update your College in your Profile to see College Rankings.");
                setRankings([]);
                setLoading(false);
                return;
            }
        }
        if (data) setRankings(data);
      } catch (err) {
        console.error("Rankings error:", err);
        setError("Failed to load rankings.");
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [activeTab, user]);

  const renderRankBadge = (rank) => {
    if (rank === 1) return (
      <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] border-2 border-yellow-200">
        <Crown className="w-6 h-6 text-white fill-white" />
        <div className="absolute -bottom-2 bg-yellow-900 text-yellow-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500">#1</div>
      </div>
    );
    if (rank === 2) return (
      <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.5)] border-2 border-slate-200">
        <Medal className="w-5 h-5 text-white fill-white" />
        <div className="absolute -bottom-2 bg-slate-800 text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-500">#2</div>
      </div>
    );
    if (rank === 3) return (
      <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-b from-orange-300 to-orange-600 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] border-2 border-orange-200">
        <Award className="w-5 h-5 text-white fill-white" />
        <div className="absolute -bottom-2 bg-orange-900 text-orange-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500">#3</div>
      </div>
    );
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-white/5 rounded-full border border-white/10 font-mono font-bold text-muted-foreground">
        #{rank}
      </div>
    );
  };

  // Top 3 Podium Component
  const TopPodium = ({ topUsers }) => {
    if (topUsers.length === 0) return null;
    
    const podiumOrder = [topUsers[1], topUsers[0], topUsers[2]].filter(Boolean);
    
    return (
      // FIX: Added mt-32. This PUSHES the podium down, creating a gap from the buttons above.
      <div className="flex justify-center items-end gap-4 md:gap-8 mb-12 mt-32">
        {podiumOrder.map((u, idx) => {
          const rank = u === topUsers[0] ? 1 : u === topUsers[1] ? 2 : 3;
          const height = rank === 1 ? 'h-64' : rank === 2 ? 'h-52' : 'h-44';
          const color = rank === 1 ? 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30' : 
                        rank === 2 ? 'from-slate-400/20 to-slate-500/5 border-slate-400/30' : 
                        'from-orange-500/20 to-orange-600/5 border-orange-500/30';
          
          return (
            <div key={u.id} className={`relative flex flex-col items-center group`}>
               <div className={`absolute -top-16 transition-all duration-500 group-hover:-translate-y-2 z-20`}>
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-background shadow-xl ${rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-slate-400' : 'border-orange-500'}`}>
                     <span className="text-2xl font-bold text-foreground">{u.name.charAt(0).toUpperCase()}</span>
                  </div>
                  {rank === 1 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />}
               </div>

               <div className={`w-28 md:w-40 ${height} rounded-t-2xl bg-gradient-to-b ${color} border-t border-x backdrop-blur-sm flex flex-col justify-end pb-6 items-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
                  
                  <div className="text-center z-10 px-2">
                    <div className="font-bold text-foreground truncate max-w-[100px] md:max-w-full">{u.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[100px] md:max-w-full">{u.college}</div>
                    <div className="mt-3 font-mono font-bold text-xl text-primary">{u.totalScore}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Points</div>
                  </div>
               </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 via-background to-background"></div>
      
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* FIX: Changed mb-12 to mb-2. This PULLS the buttons up towards the title. */}
          <div className={`text-center mb-2 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
               <Trophy className="w-4 h-4" /> Season 1 Leaderboard
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Rankings</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compete with the top developers from around the world. Solve problems, earn points, and climb the ladder of excellence.
            </p>
          </div>

          {/* Tab Switcher (Buttons) */}
          <div className="flex justify-center mb-12">
            <div className="p-1 bg-background/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg flex gap-1">
              {['global', 'college'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Rankings
                </button>
              ))}
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
             <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                 <p className="text-muted-foreground animate-pulse">Fetching leaderboard data...</p>
             </div>
          )}

          {!loading && error && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-red-500/5 border border-red-500/20 rounded-2xl">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Link to="/profile">
                      <Button variant="outline">Update Profile</Button>
                  </Link>
              </div>
          )}

          {!loading && !error && (
            <>
              {/* Top 3 Podium */}
              <TopPodium topUsers={rankings.slice(0, 3)} />

              {/* Full List */}
              <Card className="glass-dark border-0 shadow-2xl overflow-hidden backdrop-blur-xl relative z-20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hacker</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solved</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Institution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rankings.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-12 text-muted-foreground">No rankings available yet. Be the first!</td></tr>
                      ) : (
                        rankings.map((rankUser, index) => {
                            const isCurrentUser = user && user.email === rankUser.email;
                            return (
                            <tr
                              key={rankUser.id}
                              className={`group transition-all duration-200 ${
                                isCurrentUser 
                                  ? 'bg-primary/10 hover:bg-primary/15' 
                                  : 'hover:bg-white/5'
                              }`}
                            >
                              <td className="px-6 py-4">
                                {renderRankBadge(index + 1)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner ${
                                    ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'][index % 4]
                                  }`}>
                                    {rankUser.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-4">
                                    <div className={`text-sm font-bold flex items-center ${
                                      isCurrentUser ? 'text-primary' : 'text-foreground'
                                    }`}>
                                      {rankUser.name}
                                      {isCurrentUser && (
                                        <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">YOU</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Shield className="w-3 h-3" /> Lvl {Math.floor(rankUser.problemsSolved / 5) + 1}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-mono text-lg font-bold text-primary">
                                  {rankUser.totalScore.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm font-medium text-emerald-500">{rankUser.problemsSolved}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-muted-foreground truncate max-w-[150px] block" title={rankUser.college}>
                                  {rankUser.college || '-'}
                                </span>
                              </td>
                            </tr>
                            )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rankings