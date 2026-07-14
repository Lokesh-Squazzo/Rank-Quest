import { useState, useEffect } from 'react'
import { Trophy, Star, Zap, Target, Award, Crown, Medal, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

const GamificationSystem = ({ userStats, solvedProblems = new Set() }) => {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('achievements') // achievements, badges, rewards
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Achievement system
  const achievements = [
    {
      id: 'first-solve',
      title: 'First Steps',
      description: 'Solve your first problem',
      icon: <Target className="h-6 w-6" />,
      progress: 1,
      target: 1,
      completed: true,
      points: 10,
      rarity: 'common',
      unlockedAt: '2024-01-10'
    },
    {
      id: 'problem-solver',
      title: 'Problem Solver',
      description: 'Solve 50 problems',
      icon: <Zap className="h-6 w-6" />,
      progress: 47,
      target: 50,
      completed: false,
      points: 100,
      rarity: 'uncommon'
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 30-day solving streak',
      icon: <Star className="h-6 w-6" />,
      progress: 15,
      target: 30,
      completed: false,
      points: 200,
      rarity: 'rare'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Solve 10 problems in under 15 minutes each',
      icon: <Zap className="h-6 w-6" />,
      progress: 6,
      target: 10,
      completed: false,
      points: 150,
      rarity: 'rare'
    },
    {
      id: 'hard-problems',
      title: 'Challenge Accepted',
      description: 'Solve 25 hard difficulty problems',
      icon: <Crown className="h-6 w-6" />,
      progress: 8,
      target: 25,
      completed: false,
      points: 300,
      rarity: 'epic'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Solve 20 problems on first attempt',
      icon: <Award className="h-6 w-6" />,
      progress: 12,
      target: 20,
      completed: false,
      points: 250,
      rarity: 'epic'
    }
  ]

  // Badge system
  const badges = [
    {
      id: 'array-master',
      title: 'Array Master',
      description: 'Expert in array problems',
      icon: '🔢',
      earned: true,
      earnedAt: '2024-01-12',
      category: 'Topic Mastery',
      level: 3,
      maxLevel: 5
    },
    {
      id: 'string-ninja',
      title: 'String Ninja',
      description: 'Master of string manipulation',
      icon: '🔤',
      earned: true,
      earnedAt: '2024-01-08',
      category: 'Topic Mastery',
      level: 2,
      maxLevel: 5
    },
    {
      id: 'tree-climber',
      title: 'Tree Climber',
      description: 'Skilled in tree algorithms',
      icon: '🌳',
      earned: false,
      category: 'Topic Mastery',
      level: 1,
      maxLevel: 5,
      progress: 60
    },
    {
      id: 'graph-explorer',
      title: 'Graph Explorer',
      description: 'Navigator of graph problems',
      icon: '🗺️',
      earned: false,
      category: 'Topic Mastery',
      level: 0,
      maxLevel: 5,
      progress: 25
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Solve problems before 8 AM',
      icon: '🌅',
      earned: true,
      earnedAt: '2024-01-05',
      category: 'Behavior',
      level: 1,
      maxLevel: 3
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Solve problems after 10 PM',
      icon: '🦉',
      earned: false,
      category: 'Behavior',
      level: 0,
      maxLevel: 3,
      progress: 80
    }
  ]

  // Reward system
  const rewards = [
    {
      id: 'profile-theme',
      title: 'Cosmic Profile Theme',
      description: 'Unlock a beautiful cosmic theme for your profile',
      cost: 500,
      type: 'cosmetic',
      icon: '🌌',
      owned: false,
      category: 'Themes'
    },
    {
      id: 'custom-badge',
      title: 'Custom Badge Creator',
      description: 'Create your own custom achievement badge',
      cost: 1000,
      type: 'feature',
      icon: '🎨',
      owned: false,
      category: 'Features'
    },
    {
      id: 'priority-support',
      title: 'Priority Support',
      description: 'Get priority customer support for 30 days',
      cost: 750,
      type: 'service',
      icon: '⚡',
      owned: false,
      category: 'Services'
    },
    {
      id: 'exclusive-problems',
      title: 'Exclusive Problem Set',
      description: 'Access to premium problem collections',
      cost: 1500,
      type: 'content',
      icon: '💎',
      owned: true,
      category: 'Content'
    }
  ]

  const currentPoints = 1250 // Mock user points

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'uncommon': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getBadgeLevelColor = (level, maxLevel) => {
    const percentage = (level / maxLevel) * 100
    if (percentage >= 80) return 'text-purple-400'
    if (percentage >= 60) return 'text-blue-400'
    if (percentage >= 40) return 'text-emerald-400'
    if (percentage >= 20) return 'text-amber-400'
    return 'text-gray-400'
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header with Points and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Achievements & Rewards
          </h2>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl px-4 py-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="font-bold text-yellow-400">{currentPoints.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>
        </div>
        
        <div className="flex bg-background/30 border border-white/20 rounded-xl p-1">
          {[
            { key: 'achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
            { key: 'badges', label: 'Badges', icon: <Medal className="h-4 w-4" /> },
            { key: 'rewards', label: 'Rewards', icon: <Gift className="h-4 w-4" /> }
          ].map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center space-x-2 ${
                activeSection === section.key
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      {activeSection === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`glass-dark border-0 shadow-2xl transition-all duration-500 ${
              achievement.completed ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    achievement.completed 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                      : 'bg-gradient-to-br from-gray-600 to-gray-700'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="text-right">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <div className="text-sm text-yellow-400 font-medium mt-1">
                      +{achievement.points} pts
                    </div>
                  </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 ${
                  achievement.completed ? 'text-emerald-400' : 'text-foreground'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

                {achievement.completed ? (
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Completed {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{achievement.progress}/{achievement.target}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Badges Section */}
      {activeSection === 'badges' && (
        <div className="space-y-6">
          {['Topic Mastery', 'Behavior'].map((category) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.filter(badge => badge.category === category).map((badge) => (
                  <Card key={badge.id} className={`glass-dark border-0 shadow-2xl transition-all duration-500 ${
                    badge.earned ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20' : ''
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <h4 className={`font-bold mb-2 ${badge.earned ? 'text-blue-400' : 'text-foreground'}`}>
                        {badge.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
                      
                      {badge.earned ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <Medal className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-400">
                              Level {badge.level}/{badge.maxLevel}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{badge.progress || 0}%</span>
                          </div>
                          <Progress value={badge.progress || 0} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards Section */}
      {activeSection === 'rewards' && (
        <div className="space-y-6">
          {['Themes', 'Features', 'Services', 'Content'].map((category) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.filter(reward => reward.category === category).map((reward) => (
                  <Card key={reward.id} className={`glass-dark border-0 shadow-2xl transition-all duration-500 ${
                    reward.owned ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{reward.icon}</div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="h-4 w-4" />
                            <span className="font-bold">{reward.cost.toLocaleString()}</span>
                          </div>
                          {reward.owned && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-1">
                              Owned
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold text-foreground mb-2">{reward.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

                      <Button 
                        className={`w-full rounded-xl ${
                          reward.owned 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed' 
                            : currentPoints >= reward.cost
                              ? 'bg-gradient-primary hover:bg-gradient-primary/90 text-white'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30 cursor-not-allowed'
                        }`}
                        disabled={reward.owned || currentPoints < reward.cost}
                      >
                        {reward.owned ? 'Owned' : currentPoints >= reward.cost ? 'Purchase' : 'Insufficient Points'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GamificationSystem
