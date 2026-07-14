# DSA Platform API Specification

## Base URL
```
https://api.dsaplatform.com/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication APIs

### 1.1 User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "college": "IIT Delhi",
  "year": "3rd Year",
  "branch": "Computer Science"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "college": "IIT Delhi",
      "year": "3rd Year",
      "branch": "Computer Science",
      "avatar": "https://api.dsaplatform.com/avatars/default.png",
      "createdAt": "2024-01-20T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "college": "IIT Delhi",
      "year": "3rd Year",
      "branch": "Computer Science",
      "avatar": "https://api.dsaplatform.com/avatars/user_123.png",
      "stats": {
        "totalSolved": 247,
        "easyCount": 89,
        "mediumCount": 132,
        "hardCount": 26,
        "currentStreak": 15,
        "longestStreak": 42,
        "collegeRank": 12,
        "globalRank": 1847
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here"
  }
}
```

### 1.4 Logout
**POST** `/auth/logout` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. User Profile APIs

### 2.1 Get User Profile
**GET** `/users/profile` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "college": "IIT Delhi",
      "year": "3rd Year",
      "branch": "Computer Science",
      "avatar": "https://api.dsaplatform.com/avatars/user_123.png",
      "bio": "Passionate about algorithms and data structures",
      "location": "New Delhi, India",
      "github": "johndoe",
      "linkedin": "johndoe",
      "website": "https://johndoe.dev",
      "createdAt": "2024-01-20T10:30:00Z",
      "stats": {
        "totalSolved": 247,
        "easyCount": 89,
        "mediumCount": 132,
        "hardCount": 26,
        "currentStreak": 15,
        "longestStreak": 42,
        "collegeRank": 12,
        "globalRank": 1847,
        "sheetsCompleted": 3,
        "totalSheets": 8
      },
      "achievements": [
        {
          "id": "achievement_1",
          "title": "First Problem Solved",
          "icon": "🎯",
          "description": "Solved your first problem",
          "unlockedAt": "2024-01-20T11:00:00Z"
        }
      ],
      "recentActivity": [
        {
          "id": "activity_1",
          "date": "2024-01-20T15:30:00Z",
          "action": "Solved 'Two Sum' problem",
          "type": "solve",
          "problemId": "problem_1"
        }
      ]
    }
  }
}
```

### 2.2 Update User Profile
**PUT** `/users/profile` (Authenticated)

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "location": "Mumbai, India",
  "github": "johndoe_updated",
  "linkedin": "johndoe_updated",
  "website": "https://johndoe-updated.dev"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe Updated",
      "email": "john@example.com",
      "bio": "Updated bio",
      "location": "Mumbai, India",
      "github": "johndoe_updated",
      "linkedin": "johndoe_updated",
      "website": "https://johndoe-updated.dev"
    }
  }
}
```

### 2.3 Change Password
**PUT** `/users/password` (Authenticated)

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 2.4 Upload Avatar
**POST** `/users/avatar` (Authenticated)

**Request:** Multipart form data with image file

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://api.dsaplatform.com/avatars/user_123.png"
  }
}
```

---

## 3. DSA Sheets APIs

### 3.1 Get All Sheets
**GET** `/sheets`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sheets": [
      {
        "id": "sheet_1",
        "name": "Striver SDE Sheet",
        "author": "Raj Vikramaditya (Striver)",
        "description": "Complete preparation for Software Development Engineer roles",
        "totalProblems": 191,
        "difficulty": "Mixed",
        "estimatedTime": "3-4 months",
        "tags": ["SDE", "Interview Prep", "Complete"],
        "color": "bg-gradient-to-r from-blue-500 to-blue-600",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3.2 Get Sheet Details
**GET** `/sheets/{sheetId}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sheet": {
      "id": "sheet_1",
      "name": "Striver SDE Sheet",
      "author": "Raj Vikramaditya (Striver)",
      "description": "Complete preparation for Software Development Engineer roles",
      "totalProblems": 191,
      "difficulty": "Mixed",
      "estimatedTime": "3-4 months",
      "tags": ["SDE", "Interview Prep", "Complete"],
      "color": "bg-gradient-to-r from-blue-500 to-blue-600",
      "problems": [
        {
          "id": "problem_1",
          "title": "Two Sum",
          "difficulty": "Easy",
          "topic": "Arrays",
          "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
          "gfgUrl": "https://practice.geeksforgeeks.org/problems/key-pair5616/",
          "companies": ["Amazon", "Google", "Microsoft"],
          "tags": ["Hash Table", "Array"],
          "acceptance": "49.1%",
          "submissions": "4.2M",
          "notes": "Classic hash map problem",
          "isSolved": false,
          "solvedAt": null
        }
      ],
      "userProgress": {
        "totalSolved": 45,
        "easyCount": 20,
        "mediumCount": 20,
        "hardCount": 5,
        "completionPercentage": 23.6
      }
    }
  }
}
```

---

## 4. Problems APIs

### 4.1 Get All Problems
**GET** `/problems`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search term
- `difficulty` (optional): Easy, Medium, Hard
- `topic` (optional): Arrays, Strings, Trees, etc.
- `sheetId` (optional): Filter by sheet
- `solved` (optional): true/false (requires authentication)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problems": [
      {
        "id": "problem_1",
        "title": "Two Sum",
        "difficulty": "Easy",
        "topic": "Arrays",
        "sheetId": "sheet_1",
        "sheetName": "Striver SDE Sheet",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/key-pair5616/",
        "companies": ["Amazon", "Google", "Microsoft"],
        "tags": ["Hash Table", "Array"],
        "acceptance": "49.1%",
        "submissions": "4.2M",
        "notes": "Classic hash map problem",
        "isSolved": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalItems": 500,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4.2 Get Problem Details
**GET** `/problems/{problemId}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problem": {
      "id": "problem_1",
      "title": "Two Sum",
      "difficulty": "Easy",
      "topic": "Arrays",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "examples": [
        {
          "input": "nums = [2,7,11,15], target = 9",
          "output": "[0,1]",
          "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      "constraints": [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9"
      ],
      "hints": [
        "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
        "Try using a hash table to store the complement of each number."
      ],
      "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
      "gfgUrl": "https://practice.geeksforgeeks.org/problems/key-pair5616/",
      "companies": ["Amazon", "Google", "Microsoft"],
      "tags": ["Hash Table", "Array"],
      "acceptance": "49.1%",
      "submissions": "4.2M",
      "testCases": [
        {
          "input": "[2,7,11,15]\n9",
          "expectedOutput": "[0,1]"
        }
      ],
      "starterCode": {
        "python": "def twoSum(nums, target):\n    # Your code here\n    pass",
        "java": "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[]{};\n}",
        "cpp": "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}",
        "javascript": "var twoSum = function(nums, target) {\n    // Your code here\n};"
      },
      "isSolved": false,
      "solvedAt": null,
      "userSubmissions": 3,
      "lastAttemptAt": "2024-01-19T14:30:00Z"
    }
  }
}
```

---

## 5. Problem Submission APIs

### 5.1 Submit Solution
**POST** `/problems/{problemId}/submit` (Authenticated)

**Request Body:**
```json
{
  "code": "def twoSum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []",
  "language": "python"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissionId": "submission_123",
    "status": "Accepted",
    "runtime": "52 ms",
    "memory": "15.2 MB",
    "testCasesPassed": 57,
    "totalTestCases": 57,
    "score": 100,
    "feedback": "Excellent solution! Time complexity: O(n), Space complexity: O(n)",
    "isFirstSolve": true,
    "pointsEarned": 10,
    "newStats": {
      "totalSolved": 248,
      "easyCount": 90,
      "currentStreak": 16
    }
  }
}
```

### 5.2 Run Code (Test)
**POST** `/problems/{problemId}/run` (Authenticated)

**Request Body:**
```json
{
  "code": "def twoSum(nums, target):\n    # incomplete code",
  "language": "python",
  "testCases": [
    {
      "input": "[2,7,11,15]\n9",
      "expectedOutput": "[0,1]"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "input": "[2,7,11,15]\n9",
        "expectedOutput": "[0,1]",
        "actualOutput": "None",
        "status": "Wrong Answer",
        "runtime": "12 ms",
        "memory": "8.1 MB",
        "error": null
      }
    ],
    "overallStatus": "Failed",
    "testCasesPassed": 0,
    "totalTestCases": 1
  }
}
```

### 5.3 Get Submission History
**GET** `/problems/{problemId}/submissions` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "submission_123",
        "status": "Accepted",
        "language": "python",
        "runtime": "52 ms",
        "memory": "15.2 MB",
        "score": 100,
        "submittedAt": "2024-01-20T15:30:00Z"
      }
    ]
  }
}
```

---

## 6. User Progress APIs

### 6.1 Mark Problem as Solved
**POST** `/users/progress/problems/{problemId}/solve` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Problem marked as solved",
  "data": {
    "newStats": {
      "totalSolved": 248,
      "easyCount": 90,
      "mediumCount": 132,
      "hardCount": 26,
      "currentStreak": 16
    }
  }
}
```

### 6.2 Get User Statistics
**GET** `/users/stats` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalSolved": 247,
      "easyCount": 89,
      "mediumCount": 132,
      "hardCount": 26,
      "currentStreak": 15,
      "longestStreak": 42,
      "collegeRank": 12,
      "globalRank": 1847,
      "sheetsCompleted": 3,
      "totalSheets": 8,
      "weeklyProgress": [
        {"date": "2024-01-14", "solved": 5},
        {"date": "2024-01-15", "solved": 3},
        {"date": "2024-01-16", "solved": 7},
        {"date": "2024-01-17", "solved": 4},
        {"date": "2024-01-18", "solved": 6},
        {"date": "2024-01-19", "solved": 2},
        {"date": "2024-01-20", "solved": 8}
      ],
      "topicProgress": [
        {"topic": "Arrays", "solved": 45, "total": 60},
        {"topic": "Strings", "solved": 32, "total": 40},
        {"topic": "Trees", "solved": 28, "total": 35}
      ]
    }
  }
}
```

---

## 7. Rankings APIs

### 7.1 Get College Rankings
**GET** `/rankings/college` (Authenticated)

**Query Parameters:**
- `college` (optional): Filter by specific college
- `limit` (optional): Number of results (default: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "userId": "user_456",
        "name": "Arjun Sharma",
        "college": "IIT Delhi",
        "avatar": "https://api.dsaplatform.com/avatars/user_456.png",
        "totalSolved": 247,
        "currentStreak": 15,
        "points": 2470
      }
    ],
    "userRank": {
      "rank": 12,
      "totalUsers": 1250
    }
  }
}
```

### 7.2 Get Global Rankings
**GET** `/rankings/global`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "userId": "user_789",
        "name": "CodeMaster2024",
        "college": "MIT",
        "avatar": "https://api.dsaplatform.com/avatars/user_789.png",
        "totalSolved": 892,
        "currentStreak": 45,
        "points": 8920
      }
    ],
    "userRank": {
      "rank": 1847,
      "totalUsers": 50000
    }
  }
}
```

---

## 8. Resources APIs

### 8.1 Get All Resources
**GET** `/resources`

**Query Parameters:**
- `type` (optional): Course, Book, Article, Repository
- `level` (optional): Beginner, Intermediate, Advanced
- `search` (optional): Search term

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": "resource_1",
        "title": "Complete DSA Course",
        "type": "Course",
        "provider": "Striver",
        "description": "Comprehensive course covering all DSA topics",
        "url": "https://takeuforward.org/strivers-a2z-dsa-course/",
        "rating": 4.9,
        "duration": "100+ hours",
        "level": "Beginner to Advanced",
        "tags": ["Complete", "Video", "Free"],
        "thumbnail": "https://api.dsaplatform.com/thumbnails/resource_1.jpg",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 9. Achievements APIs

### 9.1 Get User Achievements
**GET** `/users/achievements` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "achievement_1",
        "title": "First Problem Solved",
        "icon": "🎯",
        "description": "Solved your first problem",
        "unlocked": true,
        "unlockedAt": "2024-01-20T11:00:00Z",
        "category": "Milestone",
        "points": 10
      }
    ],
    "totalPoints": 150,
    "unlockedCount": 8,
    "totalAchievements": 25
  }
}
```

---

## 10. Settings APIs

### 10.1 Get User Settings
**GET** `/users/settings` (Authenticated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "notifications": {
        "email": true,
        "push": true,
        "weeklyReport": true,
        "achievementAlerts": true
      },
      "privacy": {
        "profileVisibility": "public",
        "showStats": true,
        "showActivity": true
      },
      "preferences": {
        "theme": "light",
        "language": "en",
        "defaultCodeLanguage": "python",
        "timezone": "Asia/Kolkata"
      }
    }
  }
}
```

### 10.2 Update User Settings
**PUT** `/users/settings` (Authenticated)

**Request Body:**
```json
{
  "notifications": {
    "email": false,
    "push": true,
    "weeklyReport": true,
    "achievementAlerts": false
  },
  "privacy": {
    "profileVisibility": "private",
    "showStats": false,
    "showActivity": true
  },
  "preferences": {
    "theme": "dark",
    "language": "en",
    "defaultCodeLanguage": "java",
    "timezone": "Asia/Kolkata"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "settings": {
      // Updated settings object
    }
  }
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Code submission**: 10 requests per minute
- **File upload**: 5 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```
