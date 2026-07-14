import { useState, useEffect } from 'react'
import { Users, MessageCircle, Trophy, UserPlus, Search, Crown, Target, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const SocialFeatures = ({ currentUser }) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('friends') // friends, groups, leaderboard
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock social data
  const friends = [
    {
      id: 1,
      name: 'Alex Kumar',
      username: 'alex_codes',
      avatar: '/api/placeholder/32/32',
      level: 12,
      streak: 15,
      problemsSolved: 234,
      status: 'online',
      lastSeen: 'now',
      college: 'IIT Delhi',
      currentProblem: 'Two Sum'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      username: 'priya_dev',
      avatar: '/api/placeholder/32/32',
      level: 8,
      streak: 7,
      problemsSolved: 156,
      status: 'solving',
      lastSeen: '5 min ago',
      college: 'BITS Pilani',
      currentProblem: 'Binary Tree Traversal'
    },
    {
      id: 3,
      name: 'Rohit Patel',
      username: 'rohit_algo',
      avatar: '/api/placeholder/32/32',
      level: 15,
      streak: 23,
      problemsSolved: 312,
      status: 'offline',
      lastSeen: '2 hours ago',
      college: 'IIT Bombay',
      currentProblem: null
    }
  ]

  const studyGroups = [
    {
      id: 1,
      name: 'FAANG Prep Squad',
      description: 'Preparing for top tech companies together',
      members: 24,
      avatar: '/api/placeholder/40/40',
      isPrivate: false,
      tags: ['FAANG', 'Interview Prep', 'Advanced'],
      activity: 'High',
      weeklyGoal: 15,
      completedThisWeek: 12,
      nextSession: '2024-01-15T18:00:00Z'
    },
    {
      id: 2,
      name: 'Beginner Friendly',
      description: 'Learning DSA fundamentals step by step',
      members: 45,
      avatar: '/api/placeholder/40/40',
      isPrivate: false,
      tags: ['Beginner', 'Fundamentals', 'Supportive'],
      activity: 'Medium',
      weeklyGoal: 8,
      completedThisWeek: 6,
      nextSession: '2024-01-16T19:00:00Z'
    },
    {
      id: 3,
      name: 'IIT Delhi Chapter',
      description: 'College-specific study group for IIT Delhi students',
      members: 18,
      avatar: '/api/placeholder/40/40',
      isPrivate: true,
      tags: ['IIT Delhi', 'College', 'Competitive'],
      activity: 'High',
      weeklyGoal: 20,
      completedThisWeek: 18,
      nextSession: '2024-01-14T20:00:00Z'
    }
  ]

  const globalLeaderboard = [
    { rank: 1, name: 'Arjun Mehta', college: 'IIT Bombay', solved: 456, streak: 45, level: 20 },
    { rank: 2, name: 'Sneha Gupta', college: 'IIIT Hyderabad', solved: 423, streak: 32, level: 19 },
    { rank: 3, name: 'Vikash Singh', college: 'IIT Delhi', solved: 398, streak: 28, level: 18 },
    { rank: 4, name: 'Ananya Rao', college: 'BITS Pilani', solved: 367, streak: 25, level: 17 },
    { rank: 5, name: 'Karthik Nair', college: 'NIT Trichy', solved: 345, streak: 22, level: 16 }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'solving': return 'bg-amber-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'High': return 'text-emerald-400'
      case 'Medium': return 'text-amber-400'
      case 'Low': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header with Tab Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Social Hub
        </h2>
        <div className="flex bg-background/30 border border-white/20 rounded-xl p-1">
          {[
            { key: 'friends', label: 'Friends', icon: <Users className="h-4 w-4" /> },
            { key: 'groups', label: 'Study Groups', icon: <MessageCircle className="h-4 w-4" /> },
            { key: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-white/20 rounded-xl"
        />
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Friends ({friends.length})</h3>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90 rounded-xl">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <Card key={friend.id} className="glass-dark border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-background`}></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{friend.name}</h4>
                      <p className="text-sm text-muted-foreground">@{friend.username}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Lvl {friend.level}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">College:</span>
                      <span className="font-medium">{friend.college}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Problems Solved:</span>
                      <span className="font-medium text-emerald-400">{friend.problemsSolved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Streak:</span>
                      <span className="font-medium text-orange-400">{friend.streak} days</span>
                    </div>
                    {friend.currentProblem && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
                        <p className="text-xs text-primary">Currently solving: {friend.currentProblem}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 border-white/20 hover:bg-white/10">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-white/20 hover:bg-white/10">
                      <Target className="h-4 w-4 mr-1" />
                      Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Study Groups</h3>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90 rounded-xl">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="glass-dark border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.avatar} alt={group.name} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {group.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center space-x-2">
                          <span>{group.name}</span>
                          {group.isPrivate && <Badge className="bg-amber-500/20 text-amber-400 text-xs">Private</Badge>}
                        </h4>
                        <p className="text-sm text-muted-foreground">{group.members} members</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${getActivityColor(group.activity)}`}>
                      {group.activity} Activity
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag, index) => (
                      <Badge key={index} className="bg-muted/50 text-muted-foreground border-muted text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weekly Goal:</span>
                      <span className="font-medium">{group.completedThisWeek}/{group.weeklyGoal} problems</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(group.completedThisWeek / group.weeklyGoal) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Session:</span>
                      <span className="font-medium text-blue-400">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(group.nextSession).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:bg-gradient-primary/90 rounded-xl">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card className="glass-dark border-0 shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl">Global Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {globalLeaderboard.map((user, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-background/20 border border-white/10 rounded-xl hover:bg-background/30 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      {user.rank <= 3 ? (
                        <div className={`p-2 rounded-full ${
                          user.rank === 1 ? 'bg-yellow-500' : 
                          user.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}>
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-sm font-bold">
                          {user.rank}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-foreground">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.college}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-emerald-400">{user.solved}</div>
                        <div className="text-xs text-muted-foreground">Solved</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-400">{user.streak}</div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">{user.level}</div>
                        <div className="text-xs text-muted-foreground">Level</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SocialFeatures
