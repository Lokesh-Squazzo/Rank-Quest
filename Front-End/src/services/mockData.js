// Mock data service for the DSA Platform
export const mockSheets = [
  {
    id: 'striver-sde',
    name: 'Striver SDE Sheet',
    author: 'Raj Vikramaditya (Striver)',
    description: 'Complete preparation for Software Development Engineer roles with 191 most important problems',
    totalProblems: 191,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    difficulty: 'Mixed',
    estimatedTime: '3-4 months',
    tags: ['SDE', 'Interview Prep', 'Complete']
  },
  {
    id: 'love-babbar-450',
    name: 'Love Babbar 450',
    author: 'Love Babbar',
    description: 'Most loved DSA Sheet with 450 problems covering all important topics',
    totalProblems: 450,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    difficulty: 'Mixed',
    estimatedTime: '4-6 months',
    tags: ['Complete', 'Beginner Friendly', 'Comprehensive']
  },
  {
    id: 'neetcode-150',
    name: 'NeetCode 150',
    author: 'NeetCode',
    description: 'Curated list of 150 LeetCode problems for coding interviews',
    totalProblems: 150,
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    difficulty: 'Medium-Hard',
    estimatedTime: '2-3 months',
    tags: ['LeetCode', 'Interview', 'Curated']
  },
  {
    id: 'blind-75',
    name: 'Blind 75',
    author: 'Blind Community',
    description: 'The most popular 75 LeetCode problems for technical interviews',
    totalProblems: 75,
    color: 'bg-gradient-to-r from-red-500 to-red-600',
    difficulty: 'Medium-Hard',
    estimatedTime: '1-2 months',
    tags: ['Essential', 'Interview', 'Popular']
  },
  {
    id: 'gfg-top-50',
    name: 'GeeksforGeeks Top 50',
    author: 'GeeksforGeeks',
    description: 'Top 50 array problems to master array data structure',
    totalProblems: 50,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    difficulty: 'Easy-Medium',
    estimatedTime: '2-3 weeks',
    tags: ['Arrays', 'Beginner', 'Foundation']
  }
]

export const mockProblems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    sheetId: 'striver-sde',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/key-pair5616/',
    notes: 'Classic hash map problem - foundation for many other problems',
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
    tags: ['Hash Table', 'Array'],
    acceptance: '49.1%',
    submissions: '4.2M'
  },
  {
    id: 2,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'Arrays',
    sheetId: 'striver-sde',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/stock-buy-and-sell/',
    notes: 'Important DP and greedy problem pattern',
    companies: ['Amazon', 'Microsoft', 'Apple'],
    tags: ['Dynamic Programming', 'Array'],
    acceptance: '54.2%',
    submissions: '2.8M'
  },
  {
    id: 3,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topic: 'Arrays',
    sheetId: 'neetcode-150',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    gfgUrl: null,
    notes: 'Simple hash set problem for duplicate detection',
    companies: ['Google', 'Apple'],
    tags: ['Hash Table', 'Array'],
    acceptance: '60.8%',
    submissions: '1.9M'
  },
  {
    id: 4,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topic: 'Arrays',
    sheetId: 'love-babbar-450',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/kadanes-algorithm/',
    notes: 'Kadane\'s algorithm - classic DP problem',
    companies: ['Amazon', 'Microsoft', 'LinkedIn'],
    tags: ['Dynamic Programming', 'Array'],
    acceptance: '49.7%',
    submissions: '2.1M'
  },
  {
    id: 5,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topic: 'Arrays',
    sheetId: 'blind-75',
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    gfgUrl: null,
    notes: 'Clever array manipulation without division',
    companies: ['Facebook', 'Amazon', 'Microsoft'],
    tags: ['Array', 'Prefix Sum'],
    acceptance: '64.4%',
    submissions: '1.5M'
  },
  {
    id: 6,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    sheetId: 'striver-sde',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/',
    notes: 'Fundamental linked list operation',
    companies: ['Google', 'Amazon', 'Microsoft'],
    tags: ['Linked List', 'Recursion'],
    acceptance: '72.1%',
    submissions: '2.3M'
  },
  {
    id: 7,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topic: 'Linked List',
    sheetId: 'neetcode-150',
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/',
    notes: 'Classic merge operation for linked lists',
    companies: ['Amazon', 'Microsoft', 'Apple'],
    tags: ['Linked List', 'Recursion'],
    acceptance: '62.8%',
    submissions: '1.8M'
  },
  {
    id: 8,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    sheetId: 'blind-75',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/parenthesis-checker/',
    notes: 'Classic stack application problem',
    companies: ['Google', 'Facebook', 'Amazon'],
    tags: ['Stack', 'String'],
    acceptance: '40.7%',
    submissions: '2.7M'
  },
  {
    id: 9,
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    topic: 'Trees',
    sheetId: 'love-babbar-450',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/inorder-traversal/',
    notes: 'Fundamental tree traversal technique',
    companies: ['Microsoft', 'Amazon'],
    tags: ['Tree', 'Depth-First Search'],
    acceptance: '74.8%',
    submissions: '1.4M'
  },
  {
    id: 10,
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    sheetId: 'neetcode-150',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    gfgUrl: 'https://practice.geeksforgeeks.org/problems/height-of-binary-tree/',
    notes: 'Simple recursive tree problem',
    companies: ['LinkedIn', 'Apple'],
    tags: ['Tree', 'Depth-First Search'],
    acceptance: '73.2%',
    submissions: '1.6M'
  }
]

export const mockRankings = {
  college: [
    { rank: 1, name: 'Arjun Sharma', college: 'IIT Delhi', solved: 247, streak: 15 },
    { rank: 2, name: 'Priya Patel', college: 'IIT Delhi', solved: 234, streak: 12 },
    { rank: 3, name: 'Rahul Kumar', college: 'IIT Delhi', solved: 221, streak: 8 },
    { rank: 4, name: 'Sneha Singh', college: 'IIT Delhi', solved: 198, streak: 22 },
    { rank: 5, name: 'Amit Verma', college: 'IIT Delhi', solved: 187, streak: 5 }
  ],
  global: [
    { rank: 1, name: 'CodeMaster2024', college: 'MIT', solved: 892, streak: 45 },
    { rank: 2, name: 'AlgoExpert', college: 'Stanford', solved: 856, streak: 38 },
    { rank: 3, name: 'DSA_Ninja', college: 'IIT Bombay', solved: 834, streak: 42 },
    { rank: 4, name: 'ProblemSolver', college: 'Carnegie Mellon', solved: 798, streak: 28 },
    { rank: 5, name: 'CodeWarrior', college: 'UC Berkeley', solved: 776, streak: 35 }
  ]
}

export const mockResources = [
  {
    id: 1,
    title: 'Complete DSA Course',
    type: 'Course',
    provider: 'Striver',
    description: 'Comprehensive course covering all DSA topics with detailed explanations',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/',
    rating: 4.9,
    duration: '100+ hours',
    level: 'Beginner to Advanced',
    tags: ['Complete', 'Video', 'Free']
  },
  {
    id: 2,
    title: 'Algorithms Specialization',
    type: 'Course',
    provider: 'Coursera',
    description: 'Stanford University algorithms course by Tim Roughgarden',
    url: 'https://www.coursera.org/specializations/algorithms',
    rating: 4.8,
    duration: '4 months',
    level: 'Intermediate',
    tags: ['University', 'Paid', 'Certificate']
  },
  {
    id: 3,
    title: 'Cracking the Coding Interview',
    type: 'Book',
    provider: 'Gayle McDowell',
    description: 'The most popular book for coding interview preparation',
    url: 'https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850',
    rating: 4.7,
    duration: '300+ pages',
    level: 'All Levels',
    tags: ['Interview', 'Book', 'Classic']
  },
  {
    id: 4,
    title: 'LeetCode Patterns',
    type: 'Article',
    provider: 'LeetCode',
    description: 'Common patterns and techniques for solving coding problems',
    url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns',
    rating: 4.6,
    duration: '2-3 hours',
    level: 'Intermediate',
    tags: ['Patterns', 'Free', 'Reference']
  },
  {
    id: 5,
    title: 'System Design Primer',
    type: 'Repository',
    provider: 'GitHub',
    description: 'Learn how to design large-scale systems',
    url: 'https://github.com/donnemartin/system-design-primer',
    rating: 4.9,
    duration: 'Self-paced',
    level: 'Advanced',
    tags: ['System Design', 'Free', 'Comprehensive']
  }
]

export const mockAchievements = [
  { id: 1, title: 'First Problem Solved', icon: '🎯', description: 'Solved your first problem', unlocked: true },
  { id: 2, title: '7-Day Streak', icon: '🔥', description: 'Maintained a 7-day solving streak', unlocked: true },
  { id: 3, title: '30-Day Streak', icon: '💪', description: 'Maintained a 30-day solving streak', unlocked: false },
  { id: 4, title: '100 Problems Solved', icon: '💯', description: 'Solved 100 problems', unlocked: true },
  { id: 5, title: 'Array Master', icon: '📊', description: 'Solved 50 array problems', unlocked: true },
  { id: 6, title: 'String Specialist', icon: '🔤', description: 'Solved 30 string problems', unlocked: true },
  { id: 7, title: 'Tree Traverser', icon: '🌳', description: 'Solved 25 tree problems', unlocked: true },
  { id: 8, title: 'Graph Explorer', icon: '🕸️', description: 'Solved 20 graph problems', unlocked: false },
  { id: 9, title: 'DP Dynamo', icon: '⚡', description: 'Solved 30 DP problems', unlocked: false },
  { id: 10, title: 'Speed Demon', icon: '🏃', description: 'Solved a problem in under 5 minutes', unlocked: false }
]

// Helper functions for data manipulation
export const getSheetById = (id) => {
  return mockSheets.find(sheet => sheet.id === id)
}

export const getProblemsBySheet = (sheetId) => {
  return mockProblems.filter(problem => problem.sheetId === sheetId)
}

export const getProblemById = (id) => {
  return mockProblems.find(problem => problem.id === parseInt(id))
}

export const getResourcesByType = (type) => {
  if (type === 'all') return mockResources
  return mockResources.filter(resource => resource.type.toLowerCase() === type.toLowerCase())
}

export const searchProblems = (query, filters = {}) => {
  let results = mockProblems
  
  if (query) {
    results = results.filter(problem => 
      problem.title.toLowerCase().includes(query.toLowerCase()) ||
      problem.topic.toLowerCase().includes(query.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }
  
  if (filters.difficulty && filters.difficulty !== 'all') {
    results = results.filter(problem => problem.difficulty === filters.difficulty)
  }
  
  if (filters.topic && filters.topic !== 'all') {
    results = results.filter(problem => problem.topic === filters.topic)
  }
  
  return results
}

export const getUserStats = (userId) => {
  // Mock user statistics
  return {
    totalSolved: 247,
    easyCount: 89,
    mediumCount: 132,
    hardCount: 26,
    currentStreak: 15,
    longestStreak: 42,
    collegeRank: 12,
    globalRank: 1847,
    sheetsCompleted: 3,
    totalSheets: mockSheets.length,
    recentActivity: [
      { date: '2024-01-20', action: 'Solved 8 problems in Striver SDE Sheet', type: 'solve' },
      { date: '2024-01-19', action: 'Completed Arrays section in Love Babbar 450', type: 'complete' },
      { date: '2024-01-18', action: 'Started NeetCode 150 sheet', type: 'start' },
      { date: '2024-01-17', action: 'Achieved 7-day solving streak', type: 'achievement' }
    ]
  }
}
