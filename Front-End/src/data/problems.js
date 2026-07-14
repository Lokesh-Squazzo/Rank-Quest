// This acts as your frontend database for problem metadata
export const problems = [
    // Striver SDE Sheet (1-5)
    { id: 1, title: "Set Matrix Zeroes", difficulty: "Medium", sheet: "striver-sde" },
    { id: 2, title: "Pascal's Triangle", difficulty: "Easy", sheet: "striver-sde" },
    { id: 3, title: "Next Permutation", difficulty: "Medium", sheet: "striver-sde" },
    { id: 4, title: "Kadane's Algorithm", difficulty: "Medium", sheet: "striver-sde" },
    { id: 5, title: "Sort Colors", difficulty: "Medium", sheet: "striver-sde" },
    
    // Love Babbar (6-10)
    { id: 6, title: "Reverse the array", difficulty: "Easy", sheet: "love-babbar-450" },
    { id: 7, title: "Max Min in Array", difficulty: "Easy", sheet: "love-babbar-450" },
    { id: 8, title: "Kth max min element", difficulty: "Medium", sheet: "love-babbar-450" },
    { id: 9, title: "Sort 0 1 2", difficulty: "Easy", sheet: "love-babbar-450" },
    { id: 10, title: "Move negatives", difficulty: "Easy", sheet: "love-babbar-450" },

    // NeetCode 150 (11-15)
    { id: 11, title: "Contains Duplicate", difficulty: "Easy", sheet: "neetcode-150" },
    { id: 12, title: "Valid Anagram", difficulty: "Easy", sheet: "neetcode-150" },
    { id: 13, title: "Two Sum", difficulty: "Easy", sheet: "neetcode-150" },
    { id: 14, title: "Group Anagrams", difficulty: "Medium", sheet: "neetcode-150" },
    { id: 15, title: "Top K Frequent", difficulty: "Medium", sheet: "neetcode-150" },

    // Blind 75 (16-20)
    { id: 16, title: "Product of Array Except Self", difficulty: "Medium", sheet: "blind-75" },
    { id: 17, title: "Longest Consecutive Sequence", difficulty: "Medium", sheet: "blind-75" },
    { id: 18, title: "Valid Palindrome", difficulty: "Easy", sheet: "blind-75" },
    { id: 19, title: "3Sum", difficulty: "Medium", sheet: "blind-75" },
    { id: 20, title: "Container With Most Water", difficulty: "Medium", sheet: "blind-75" },

    // GFG Must Do (21-25) - Mocking IDs for now
    { id: 21, title: "Missing Number", difficulty: "Easy", sheet: "gfg-must-do" },
    { id: 22, title: "Leaders in Array", difficulty: "Easy", sheet: "gfg-must-do" },
    { id: 23, title: "Equilibrium Point", difficulty: "Easy", sheet: "gfg-must-do" },
    { id: 24, title: "Subarray with given sum", difficulty: "Medium", sheet: "gfg-must-do" },
    { id: 25, title: "Sort an array of 0s, 1s", difficulty: "Easy", sheet: "gfg-must-do" },

     // Apna College (26-30)
    { id: 26, title: "Max Subarray Sum", difficulty: "Easy", sheet: "apna-college" },
    { id: 27, title: "Chocolate Distribution", difficulty: "Easy", sheet: "apna-college" },
    { id: 28, title: "Search in Rotated Sorted Array", difficulty: "Medium", sheet: "apna-college" },
    { id: 29, title: "Next Permutation", difficulty: "Medium", sheet: "apna-college" },
    { id: 30, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", sheet: "apna-college" },
];

export const getDifficultyStats = (solvedIds) => {
    const stats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
    const solvedSet = new Set(solvedIds);

    problems.forEach(p => {
        if (solvedSet.has(p.id)) {
            stats[p.difficulty]++;
            stats.Total++;
        }
    });
    return stats;
};