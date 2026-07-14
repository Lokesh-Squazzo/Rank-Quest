import { useState, useEffect } from 'react'
import { Search, Filter, SlidersHorizontal, X, Clock, TrendingUp, Star, Target } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const AdvancedSearch = ({ onSearch, placeholder = "Search problems, topics, or concepts..." }) => {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: 'all',
    topic: 'all',
    company: 'all',
    timeRange: 'all',
    status: 'all',
    tags: [],
    estimatedTime: 'all'
  })
  const [recentSearches, setRecentSearches] = useState([
    'Binary Search', 'Two Pointers', 'Dynamic Programming', 'Graph Traversal'
  ])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock search suggestions
  const searchSuggestions = [
    { term: 'Binary Tree', type: 'topic', count: 45 },
    { term: 'Two Sum', type: 'problem', difficulty: 'Easy' },
    { term: 'Sliding Window', type: 'pattern', count: 23 },
    { term: 'Google Interview', type: 'company', count: 78 },
    { term: 'Dynamic Programming', type: 'topic', count: 67 },
    { term: 'Array Manipulation', type: 'concept', count: 34 }
  ]

  const filterOptions = {
    difficulty: ['Easy', 'Medium', 'Hard'],
    topic: ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking'],
    company: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Netflix', 'Uber'],
    timeRange: ['< 15 min', '15-30 min', '30-60 min', '> 60 min'],
    status: ['Solved', 'Attempted', 'Unsolved'],
    estimatedTime: ['Quick (< 15m)', 'Medium (15-45m)', 'Long (45m+)']
  }

  const popularTags = [
    'Interview Prep', 'FAANG', 'Beginner Friendly', 'Advanced', 'Optimization',
    'Mathematical', 'Bit Manipulation', 'Recursion', 'Iterative'
  ]

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.term.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 6))
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 4)
        return updated
      })
      
      // Trigger search callback
      onSearch && onSearch({ searchTerm, filters })
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const clearFilters = () => {
    setFilters({
      difficulty: 'all',
      topic: 'all',
      company: 'all',
      timeRange: 'all',
      status: 'all',
      tags: [],
      estimatedTime: 'all'
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'topic': return <Target className="h-4 w-4 text-blue-400" />
      case 'problem': return <Search className="h-4 w-4 text-emerald-400" />
      case 'pattern': return <TrendingUp className="h-4 w-4 text-purple-400" />
      case 'company': return <Star className="h-4 w-4 text-yellow-400" />
      case 'concept': return <Clock className="h-4 w-4 text-orange-400" />
      default: return <Search className="h-4 w-4 text-gray-400" />
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-12 pr-20 h-14 bg-background/50 border-white/20 rounded-xl text-lg focus:ring-2 focus:ring-primary/50"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-lg transition-all duration-300 ${
                showFilters ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-1 bg-primary text-white text-xs px-1 py-0 min-w-[16px] h-4">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
            <Button
              onClick={handleSearch}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-lg px-4"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 glass-dark border-0 shadow-2xl">
            <CardContent className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(suggestion.term)
                    setSuggestions([])
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1 text-left">
                    <span className="text-foreground font-medium">{suggestion.term}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-muted/50 text-muted-foreground text-xs">
                        {suggestion.type}
                      </Badge>
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground">
                          {suggestion.count} problems
                        </span>
                      )}
                      {suggestion.difficulty && (
                        <Badge className={`text-xs ${
                          suggestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          suggestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {suggestion.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Searches */}
      {!showFilters && recentSearches.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Recent:</span>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(search)}
                className="px-3 py-1 bg-background/30 border border-white/20 rounded-lg text-sm hover:bg-white/10 transition-all duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="glass-dark border-0 shadow-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <Select value={filters[key]} onValueChange={(value) => handleFilterChange(key, value)}>
                    <SelectTrigger className="bg-background/50 border-white/20 rounded-lg">
                      <SelectValue placeholder={`Select ${key}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-white/20">
                      <SelectItem value="all">All {key}</SelectItem>
                      {options.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Tags Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Tags</label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      filters.tags.includes(tag)
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-background/30 border border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button
              onClick={() => {
                handleSearch()
                setShowFilters(false)
              }}
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-xl"
            >
              Apply Filters & Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdvancedSearch
