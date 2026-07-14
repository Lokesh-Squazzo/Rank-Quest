import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/useToast'
import { User, Edit3, Eye, EyeOff, Camera, Trophy, Calendar, Target, TrendingUp, Clock, Award, Star, BookOpen, Code, Zap, CheckCircle, XCircle, Lock, X, Save } from 'lucide-react'

const Profile = () => {
  const { toast } = useToast()
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    rollNumber: '2021CS001',
    college: 'ABC Engineering College',
    branch: 'Computer Science',
    year: '3rd Year',
    bio: 'Passionate about Data Structures and Algorithms. Love solving complex problems and participating in coding competitions.'
  })
  
  const [stats, setStats] = useState({
    totalSolved: 245,
    easySolved: 120,
    mediumSolved: 95,
    hardSolved: 30,
    currentStreak: 15,
    maxStreak: 28,
    totalSheets: 8,
    completedSheets: 3,
    globalRank: 1247,
    collegeRank: 23
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    rollNumber: user.rollNumber,
    college: user.college,
    branch: user.branch,
    year: user.year,
    bio: user.bio
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [recentActivity] = useState([
    { id: 1, type: 'solve', description: 'Solved "Two Sum" problem', time: '2 hours ago', difficulty: 'Easy' },
    { id: 2, type: 'complete', description: 'Completed "Array" sheet', time: '1 day ago', difficulty: 'Medium' },
    { id: 3, type: 'achievement', description: 'Earned "Problem Solver" badge', time: '2 days ago', difficulty: 'Hard' },
    { id: 4, type: 'start', description: 'Started "Dynamic Programming" sheet', time: '3 days ago', difficulty: 'Hard' },
    { id: 5, type: 'solve', description: 'Solved "Binary Search" problem', time: '4 days ago', difficulty: 'Medium' }
  ])
  
  const [achievements] = useState([
    { id: 1, name: 'First Steps', description: 'Solved your first problem', icon: '🎯', earned: true, rarity: 'common' },
    { id: 2, name: 'Problem Solver', description: 'Solved 100 problems', icon: '💡', earned: true, rarity: 'rare' },
    { id: 3, name: 'Streak Master', description: 'Maintained 30-day streak', icon: '🔥', earned: false, rarity: 'epic' },
    { id: 4, name: 'Speed Demon', description: 'Solved 10 problems in one day', icon: '⚡', earned: true, rarity: 'rare' },
    { id: 5, name: 'Hard Mode', description: 'Solved 50 hard problems', icon: '💪', earned: false, rarity: 'legendary' },
    { id: 6, name: 'Sheet Completionist', description: 'Completed 5 problem sheets', icon: '📚', earned: true, rarity: 'epic' }
  ])
  
  useEffect(() => {
    setEditData({
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      college: user.college,
      branch: user.branch,
      year: user.year,
      bio: user.bio
    })
  }, [user])
  
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser(editData)
      setIsEditing(false)
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all password fields',
        variant: 'destructive'
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New passwords do not match',
        variant: 'destructive'
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change password. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'solve': return '✅'
      case 'complete': return '🎉'
      case 'start': return '🚀'
      case 'achievement': return '🏆'
      default: return '📝'
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-2xl">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Profile Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">Manage your account and track your progress</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Profile Card */}
              <Card className="glass-dark border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-background border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                      {user?.name || 'User Name'}
                    </h2>
                    <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    <div className="flex items-center justify-center space-x-2 mt-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Level {Math.floor((stats?.totalSolved || 0) / 10) + 1}
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {stats?.currentStreak || 0} day streak
                      </Badge>
                    </div>
                  </div>

                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Roll Number:</span>
                          <p className="font-medium">{user?.rollNumber || 'Not set'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">College:</span>
                          <p className="font-medium">{user?.college || 'Not set'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Branch:</span>
                          <p className="font-medium">{user?.branch || 'Not set'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Year:</span>
                          <p className="font-medium">{user?.year || 'Not set'}</p>
                        </div>
                      </div>
                      
                      {user?.bio && (
                        <div>
                          <span className="text-muted-foreground text-sm">Bio:</span>
                          <p className="text-sm mt-1">{user.bio}</p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-4">
                        <Button onClick={() => setIsEditing(true)} className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button onClick={() => setIsChangingPassword(true)} variant="outline" className="flex-1 border-white/20 hover:bg-white/10 rounded-xl">
                          <Eye className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                          <Input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="bg-background/50 border-white/20 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                          <Input
                            type="email"
                            value={editData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-background/50 border-white/20 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Roll Number</label>
                          <Input
                            type="text"
                            value={editData.rollNumber}
                            onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                            className="bg-background/50 border-white/20 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">College</label>
                          <Input
                            type="text"
                            value={editData.college}
                            onChange={(e) => handleInputChange('college', e.target.value)}
                            className="bg-background/50 border-white/20 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Branch</label>
                          <Input
                            type="text"
                            value={editData.branch}
                            onChange={(e) => handleInputChange('branch', e.target.value)}
                            className="bg-background/50 border-white/20 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Year</label>
                          <Input
                            type="text"
                            value={editData.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                            className="bg-background/50 border-white/20 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                        <textarea
                          value={editData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-white/20 rounded-xl bg-background/50 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handleSaveProfile} className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 border-white/20 hover:bg-white/10 rounded-xl" disabled={loading}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Password Change Modal */}
              {isChangingPassword && (
                <Card className="glass-dark border-0 shadow-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4">Change Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                        <Input
                          type={showPassword.current ? "text" : "password"}
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="bg-background/50 border-white/20 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                        <Input
                          type={showPassword.new ? "text" : "password"}
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="bg-background/50 border-white/20 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                        <Input
                          type={showPassword.confirm ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="bg-background/50 border-white/20 rounded-xl"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleChangePassword} className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl" disabled={loading}>
                          <Lock className="h-4 w-4 mr-2" />
                          {loading ? 'Changing...' : 'Change Password'}
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsChangingPassword(false)
                            setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''})
                          }} 
                          variant="outline" 
                          className="flex-1 border-white/20 hover:bg-white/10 rounded-xl"
                          disabled={loading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="glass-dark border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Quick Stats</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">College Rank</span>
                      <Badge variant="secondary" className="font-bold text-purple-600">#{stats.collegeRank}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Global Rank</span>
                      <Badge variant="secondary" className="font-bold text-blue-600">#{stats.globalRank}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Streak</span>
                      <Badge variant="secondary" className="font-bold text-orange-600">{stats.currentStreak} days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sheets Completed</span>
                      <Badge variant="secondary" className="font-bold text-green-600">{stats.completedSheets}/{stats.totalSheets}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Problem Solving Stats */}
              <Card className="glass-dark border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Problem Solving Statistics</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.totalSolved}</div>
                      <div className="text-muted-foreground">Total Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{stats.easySolved}</div>
                      <div className="text-muted-foreground">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.mediumSolved}</div>
                      <div className="text-muted-foreground">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-1">{stats.hardSolved}</div>
                      <div className="text-muted-foreground">Hard</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="glass-dark border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Achievements</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className={`${achievement.earned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-muted/20 border border-muted'}`}>
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <div className="font-medium text-foreground mb-1">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-dark border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{activity.description}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
