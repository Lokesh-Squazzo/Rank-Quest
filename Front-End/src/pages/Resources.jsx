import { useState, useEffect } from 'react'
import { BookOpen, Video, ExternalLink, Star, Clock, Users, Filter, Search, Library, Play, FileText, GraduationCap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const resources = [
    {
      id: 1,
      title: 'Introduction to Algorithms (CLRS)',
      type: 'book',
      category: 'algorithms',
      description: 'The comprehensive guide to algorithms and data structures',
      author: 'Cormen, Leiserson, Rivest, Stein',
      rating: 4.8,
      users: 15420,
      url: 'https://mitpress.mit.edu/books/introduction-algorithms-third-edition',
      difficulty: 'Advanced',
      topics: ['Algorithms', 'Data Structures', 'Theory']
    },
    {
      id: 2,
      title: 'Striver DSA Course',
      type: 'video',
      category: 'course',
      description: 'Complete DSA course with detailed explanations and coding',
      author: 'Raj Vikramaditya (Striver)',
      rating: 4.9,
      users: 89500,
      url: 'https://takeuforward.org/strivers-a2z-dsa-course/',
      difficulty: 'Beginner to Advanced',
      topics: ['Complete DSA', 'Interview Prep', 'Coding']
    },
    {
      id: 3,
      title: 'LeetCode Patterns',
      type: 'article',
      category: 'patterns',
      description: '14 patterns to ace any coding interview question',
      author: 'Sean Prashad',
      rating: 4.7,
      users: 23400,
      url: 'https://seanprashad.com/leetcode-patterns/',
      difficulty: 'Intermediate',
      topics: ['Patterns', 'Interview Prep', 'Problem Solving']
    },
    {
      id: 4,
      title: 'GeeksforGeeks DSA Course',
      type: 'course',
      category: 'course',
      description: 'Self-paced DSA course with practice problems',
      author: 'GeeksforGeeks',
      rating: 4.5,
      users: 45600,
      url: 'https://www.geeksforgeeks.org/dsa-self-paced-course/',
      difficulty: 'Beginner to Intermediate',
      topics: ['DSA Fundamentals', 'Practice Problems', 'Theory']
    },
    {
      id: 5,
      title: 'Cracking the Coding Interview',
      type: 'book',
      category: 'interview',
      description: '189 programming questions and solutions',
      author: 'Gayle Laakmann McDowell',
      rating: 4.6,
      users: 67800,
      url: 'https://www.crackingthecodinginterview.com/',
      difficulty: 'Intermediate',
      topics: ['Interview Questions', 'Problem Solving', 'System Design']
    },
    {
      id: 6,
      title: 'Abdul Bari Algorithms',
      type: 'video',
      category: 'algorithms',
      description: 'Algorithm analysis and design course',
      author: 'Abdul Bari',
      rating: 4.8,
      users: 34500,
      url: 'https://www.youtube.com/watch?v=0IAPZzGSbME&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
      difficulty: 'Intermediate',
      topics: ['Algorithm Analysis', 'Complexity', 'Design Patterns']
    },
    {
      id: 7,
      title: 'Dynamic Programming Patterns',
      type: 'article',
      category: 'patterns',
      description: 'Complete guide to DP patterns and techniques',
      author: 'Aditya Verma',
      rating: 4.9,
      users: 12300,
      url: 'https://www.youtube.com/watch?v=nqowUJzG-iM&list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go',
      difficulty: 'Advanced',
      topics: ['Dynamic Programming', 'Optimization', 'Problem Solving']
    },
    {
      id: 8,
      title: 'System Design Primer',
      type: 'article',
      category: 'system-design',
      description: 'Learn how to design large-scale systems',
      author: 'Donne Martin',
      rating: 4.7,
      users: 89200,
      url: 'https://github.com/donnemartin/system-design-primer',
      difficulty: 'Advanced',
      topics: ['System Design', 'Scalability', 'Architecture']
    },
    {
      id: 9,
      title: 'CS50 Introduction to Computer Science',
      type: 'course',
      category: 'fundamentals',
      description: 'Harvard\'s introduction to computer science',
      author: 'David J. Malan',
      rating: 4.9,
      users: 156000,
      url: 'https://cs50.harvard.edu/x/',
      difficulty: 'Beginner',
      topics: ['Computer Science', 'Programming', 'Fundamentals']
    },
    {
      id: 10,
      title: 'Competitive Programming Handbook',
      type: 'book',
      category: 'competitive',
      description: 'Guide to competitive programming and contests',
      author: 'Antti Laaksonen',
      rating: 4.6,
      users: 23400,
      url: 'https://cses.fi/book/book.pdf',
      difficulty: 'Advanced',
      topics: ['Competitive Programming', 'Algorithms', 'Mathematics']
    }
  ]

  const categories = ['all', 'algorithms', 'course', 'patterns', 'interview', 'system-design', 'fundamentals', 'competitive']
  const types = ['all', 'book', 'video', 'article', 'course']

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book': return <BookOpen className="h-5 w-5" />
      case 'video': return <Play className="h-5 w-5" />
      case 'course': return <GraduationCap className="h-5 w-5" />
      case 'article': return <FileText className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'book': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'video': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'course': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'article': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes('Beginner')) return 'bg-green-100 text-green-800'
    if (difficulty.includes('Intermediate')) return 'bg-yellow-100 text-yellow-800'
    if (difficulty.includes('Advanced')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className={`text-center mb-12 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg">
                <Library className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Learning Resources</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Curated collection of books, courses, and articles to master Data Structures and Algorithms
            </p>
          </div>

          {/* Search and Filters */}
          <Card className={`glass-dark border-0 shadow-2xl mb-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search resources, authors, or topics..."
                    className="pl-12 h-12 bg-background/50 border-white/20 rounded-xl focus:border-primary/50 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <select
                    className="px-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:border-primary/50 focus:ring-primary/20 min-w-[160px]"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <select
                    className="px-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:border-primary/50 focus:ring-primary/20 min-w-[120px]"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${mounted ? 'animate-stagger-in' : 'opacity-0'}`}>
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="glass-dark border-0 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <Badge className={`${getTypeColor(resource.type)} px-3 py-1 rounded-xl`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                    </div>
                    <Badge className={`px-3 py-1 rounded-xl ${
                      resource.difficulty.includes('Beginner') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      resource.difficulty.includes('Intermediate') ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {resource.difficulty}
                    </Badge>
                  </div>

                  {/* Title and Author */}
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-gradient group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 mb-4">by {resource.author}</p>

                  {/* Description */}
                  <p className="text-muted-foreground/90 text-sm mb-5 line-clamp-3 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Topics */}
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                      {resource.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1">
                          {topic}
                        </Badge>
                      ))}
                      {resource.topics.length > 3 && (
                        <Badge className="bg-muted/50 text-muted-foreground border-muted text-xs px-2 py-1">
                          +{resource.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1.5">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{resource.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-muted-foreground">{resource.users.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button asChild className="bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-xl px-4">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>

          {/* No results */}
          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No resources found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Try adjusting your search or filter criteria to find the perfect learning resource</p>
            </div>
          )}

          {/* Featured Section */}
          <Card className={`mt-16 bg-gradient-to-br from-primary via-purple-600 to-blue-600 text-white overflow-hidden border-0 shadow-3xl ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <CardContent className="p-10 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="p-4 bg-white/20 rounded-3xl w-fit mx-auto mb-6 backdrop-blur-sm">
                  <Library className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">Contribute Resources</h2>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Know a great DSA resource? Help your fellow students by suggesting it!
                </p>
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-8 py-3 rounded-xl text-lg">
                  Suggest Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Resources
