import { useState, useEffect } from 'react'
import { Trophy, Star, Zap, Target, Award, Crown, Medal, Gift, Check, Sparkles } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { problems } from '../../data/problems'

const GamificationSystem = ({ userStats = {}, solvedProblems = new Set(), user = null }) => {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('achievements') // achievements, badges, rewards

  // Persistent claimed rewards in localStorage
  const [claimedRewards, setClaimedRewards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rankquest_claimed_rewards') || '["exclusive-problems"]')
    } catch {
      return ['exclusive-problems']
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const total = userStats?.Total || 0
  const easy = userStats?.Easy || 0
  const medium = userStats?.Medium || 0
  const hard = userStats?.Hard || 0

  // Points computed from user.totalScore or weighted problem points
  const currentPoints = user?.totalScore ?? (easy * 10 + medium * 15 + hard * 20)

  // Compute solved topic counts from problems database
  const solvedSet = solvedProblems instanceof Set ? solvedProblems : new Set(solvedProblems || [])
  let arrayCount = 0
  let stringCount = 0
  let sortCount = 0
  let dpCount = 0
  let mathCount = 0

  problems.forEach(p => {
    if (solvedSet.has(p.id)) {
      if (p.topic === 'Arrays') arrayCount++
      if (p.topic === 'Strings') stringCount++
      if (p.topic === 'Sorting') sortCount++
      if (p.topic === 'Dynamic Programming') dpCount++
      if (p.topic === 'Math' || p.topic === 'Hash Table') mathCount++
    }
  })

  // Dynamic Real Achievement System
  const achievements = [
    {
      id: 'first-solve',
      title: 'First Steps',
      description: 'Solve your very first DSA problem',
      icon: <Target className="h-6 w-6" />,
      progress: Math.min(total, 1),
      target: 1,
      completed: total >= 1,
      points: 10,
      rarity: 'common'
    },
    {
      id: 'novice-hustler',
      title: 'Novice Hustler',
      description: 'Solve 5 problems across any sheet',
      icon: <Zap className="h-6 w-6" />,
      progress: Math.min(total, 5),
      target: 5,
      completed: total >= 5,
      points: 50,
      rarity: 'common'
    },
    {
      id: 'easy-master',
      title: 'Easy Breezy',
      description: 'Solve 5 easy difficulty problems',
      icon: <Award className="h-6 w-6" />,
      progress: Math.min(easy, 5),
      target: 5,
      completed: easy >= 5,
      points: 75,
      rarity: 'uncommon'
    },
    {
      id: 'medium-warrior',
      title: 'Medium Climber',
      description: 'Conquer 5 medium interview problems',
      icon: <Crown className="h-6 w-6" />,
      progress: Math.min(medium, 5),
      target: 5,
      completed: medium >= 5,
      points: 150,
      rarity: 'rare'
    },
    {
      id: 'halfway-hero',
      title: 'Halfway Hero',
      description: 'Reach 15 solved problems on RankQuest',
      icon: <Trophy className="h-6 w-6" />,
      progress: Math.min(total, 15),
      target: 15,
      completed: total >= 15,
      points: 250,
      rarity: 'epic'
    },
    {
      id: 'hardcore-champ',
      title: 'Grandmaster Challenge',
      description: 'Solve at least 1 hard difficulty problem',
      icon: <Star className="h-6 w-6" />,
      progress: Math.min(hard, 1),
      target: 1,
      completed: hard >= 1,
      points: 300,
      rarity: 'legendary'
    }
  ]

  // Dynamic Badges based on real category solves
  const badges = [
    {
      id: 'array-master',
      title: 'Array Master',
      description: 'Mastery in array manipulation and 2D matrices',
      icon: '🔢',
      earned: arrayCount >= 1,
      category: 'Topic Mastery',
      level: Math.min(arrayCount, 5),
      maxLevel: 5,
      progress: Math.min(Math.round((arrayCount / 5) * 100), 100)
    },
    {
      id: 'string-ninja',
      title: 'String Ninja',
      description: 'Expert in anagrams, palindromes, and substrings',
      icon: '🔤',
      earned: stringCount >= 1,
      category: 'Topic Mastery',
      level: Math.min(stringCount, 3),
      maxLevel: 3,
      progress: Math.min(Math.round((stringCount / 3) * 100), 100)
    },
    {
      id: 'sorting-specialist',
      title: 'Sorting Sensei',
      description: 'Skilled in partition, quickselect, and sort algorithms',
      icon: '⚡',
      earned: sortCount >= 1,
      category: 'Topic Mastery',
      level: Math.min(sortCount, 3),
      maxLevel: 3,
      progress: Math.min(Math.round((sortCount / 3) * 100), 100)
    },
    {
      id: 'dp-pioneer',
      title: 'DP Pioneer',
      description: 'Conquer Kadane and dynamic programming patterns',
      icon: '🧩',
      earned: dpCount >= 1,
      category: 'Topic Mastery',
      level: Math.min(dpCount, 2),
      maxLevel: 2,
      progress: Math.min(Math.round((dpCount / 2) * 100), 100)
    },
    {
      id: 'early-bird',
      title: 'Consistent Coder',
      description: 'Active problem solving participation on the platform',
      icon: '🌅',
      earned: total >= 1,
      category: 'Behavior',
      level: total >= 5 ? 2 : 1,
      maxLevel: 3,
      progress: Math.min(Math.round((total / 5) * 100), 100)
    },
    {
      id: 'perfectionist',
      title: 'Streak Starter',
      description: 'Build your algorithmic momentum',
      icon: '🔥',
      earned: total >= 3,
      category: 'Behavior',
      level: total >= 10 ? 3 : total >= 3 ? 1 : 0,
      maxLevel: 3,
      progress: Math.min(Math.round((total / 3) * 100), 100)
    }
  ]

  // Rewards system
  const rewards = [
    {
      id: 'cosmic-theme',
      title: 'Cosmic Nebula Profile Border',
      description: 'Unlock a glowing gradient halo around your profile avatar',
      cost: 50,
      type: 'cosmetic',
      icon: '🌌',
      category: 'Themes'
    },
    {
      id: 'custom-flair',
      title: 'Pro Developer Badge Flair',
      description: 'Display an exclusive verified coder badge next to your handle',
      cost: 100,
      type: 'feature',
      icon: '🎖️',
      category: 'Features'
    },
    {
      id: 'exclusive-problems',
      title: 'FAANG Interview Sheet Pack',
      description: 'Curated collection of 150 top company interview questions',
      cost: 0,
      type: 'content',
      icon: '💎',
      category: 'Content'
    },
    {
      id: 'code-reviewer-badge',
      title: 'Speed Demon Title',
      description: 'Showcase your lightning-fast solution capability on rankings',
      cost: 150,
      type: 'cosmetic',
      icon: '⚡',
      category: 'Themes'
    }
  ]

  const handleClaim = (rewardId, cost) => {
    if (currentPoints < cost || claimedRewards.includes(rewardId)) return
    const updated = [...claimedRewards, rewardId]
    setClaimedRewards(updated)
    try {
      localStorage.setItem('rankquest_claimed_rewards', JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed saving reward to localStorage', e)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      case 'uncommon': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'legendary': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header with Points and Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Achievements & Badges
            </h2>
            <p className="text-xs text-muted-foreground">Unlock milestones as you solve DSA sheets</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 rounded-xl px-4 py-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="font-bold text-yellow-400">{currentPoints.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground uppercase font-medium">XP</span>
          </div>

          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {[
              { key: 'achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
              { key: 'badges', label: 'Badges', icon: <Medal className="h-4 w-4" /> },
              { key: 'rewards', label: 'Rewards', icon: <Gift className="h-4 w-4" /> }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium flex items-center space-x-1.5 ${
                  activeSection === section.key
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-white/10 text-muted-foreground'
                }`}
              >
                {section.icon}
                <span className="hidden xs:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      {activeSection === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`glass-dark border-0 shadow-lg transition-all duration-300 hover:border-white/15 ${
              achievement.completed ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20' : ''
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${
                    achievement.completed 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20' 
                      : 'bg-white/10 text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="text-right">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <div className="text-xs text-yellow-400 font-semibold mt-1">
                      +{achievement.points} XP
                    </div>
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-1 ${
                  achievement.completed ? 'text-emerald-400' : 'text-foreground'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 min-h-[32px]">{achievement.description}</p>

                {achievement.completed ? (
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/20">
                    <Check className="h-4 w-4" />
                    <span>Unlocked & Claimed</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{achievement.progress}/{achievement.target}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.target) * 100} className="h-1.5" />
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
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.filter(badge => badge.category === category).map((badge) => (
                  <Card key={badge.id} className={`glass-dark border-0 shadow-lg transition-all duration-300 hover:border-white/15 ${
                    badge.earned ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border-blue-500/20' : ''
                  }`}>
                    <CardContent className="p-5 text-center">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-blue-400' : 'text-foreground'}`}>
                        {badge.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                      
                      {badge.earned ? (
                        <div className="space-y-1.5">
                          <div className="inline-flex items-center justify-center space-x-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                            <Medal className="h-3.5 w-3.5" />
                            <span>Level {badge.level}/{badge.maxLevel}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Locked</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-1.5" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => {
            const isClaimed = claimedRewards.includes(reward.id)
            const canAfford = currentPoints >= reward.cost

            return (
              <Card key={reward.id} className={`glass-dark border-0 shadow-lg flex flex-col justify-between ${
                isClaimed ? 'bg-emerald-500/10 border-emerald-500/20' : ''
              }`}>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <div className="flex items-center space-x-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                        <Sparkles className="h-3 w-3" />
                        <span>{reward.cost === 0 ? 'FREE' : `${reward.cost} XP`}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-foreground text-sm mb-1">{reward.title}</h4>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{reward.description}</p>
                  </div>

                  <Button 
                    size="sm"
                    className={`w-full rounded-lg text-xs font-semibold ${
                      isClaimed 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                        : canAfford
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'bg-white/5 text-muted-foreground border border-white/5 cursor-not-allowed'
                    }`}
                    disabled={isClaimed || !canAfford}
                    onClick={() => handleClaim(reward.id, reward.cost)}
                  >
                    {isClaimed ? 'Active / Owned' : canAfford ? 'Claim Reward' : `Need ${reward.cost - currentPoints} more XP`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GamificationSystem
