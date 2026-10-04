// This acts as your frontend database for problem metadata
export const problems = [
    // Striver SDE Sheet (1-5)
    { id: 1, title: "Set Matrix Zeroes", difficulty: "Medium", sheet: "striver-sde", topic: "Arrays", tags: ["Matrix", "Arrays", "In-Place"] },
    { id: 2, title: "Pascal's Triangle", difficulty: "Easy", sheet: "striver-sde", topic: "Math", tags: ["Math", "Combinatorics", "Arrays"] },
    { id: 3, title: "Next Permutation", difficulty: "Medium", sheet: "striver-sde", topic: "Arrays", tags: ["Two Pointers", "Arrays"] },
    { id: 4, title: "Kadane's Algorithm", difficulty: "Medium", sheet: "striver-sde", topic: "Dynamic Programming", tags: ["DP", "Arrays", "Optimization"] },
    { id: 5, title: "Sort Colors", difficulty: "Medium", sheet: "striver-sde", topic: "Sorting", tags: ["Sorting", "Two Pointers", "Arrays"] },
    
    // Love Babbar (6-10)
    { id: 6, title: "Reverse the array", difficulty: "Easy", sheet: "love-babbar-450", topic: "Arrays", tags: ["Arrays", "Two Pointers"] },
    { id: 7, title: "Max Min in Array", difficulty: "Easy", sheet: "love-babbar-450", topic: "Arrays", tags: ["Arrays", "Divide & Conquer"] },
    { id: 8, title: "Kth max min element", difficulty: "Medium", sheet: "love-babbar-450", topic: "Sorting", tags: ["Heap", "Quickselect"] },
    { id: 9, title: "Sort 0 1 2", difficulty: "Easy", sheet: "love-babbar-450", topic: "Sorting", tags: ["Sorting", "Pointers"] },
    { id: 10, title: "Move negatives", difficulty: "Easy", sheet: "love-babbar-450", topic: "Arrays", tags: ["Arrays", "Partition"] },

    // NeetCode 150 (11-15)
    { id: 11, title: "Contains Duplicate", difficulty: "Easy", sheet: "neetcode-150", topic: "Hash Table", tags: ["Hash Table", "Arrays"] },
    { id: 12, title: "Valid Anagram", difficulty: "Easy", sheet: "neetcode-150", topic: "Strings", tags: ["String", "Hash Table"] },
    { id: 13, title: "Two Sum", difficulty: "Easy", sheet: "neetcode-150", topic: "Arrays", tags: ["Hash Table", "Arrays", "Classic"] },
    { id: 14, title: "Group Anagrams", difficulty: "Medium", sheet: "neetcode-150", topic: "Strings", tags: ["String", "Sorting", "Hash Table"] },
    { id: 15, title: "Top K Frequent", difficulty: "Medium", sheet: "neetcode-150", topic: "Hash Table", tags: ["Heap", "Hash Table", "Bucket Sort"] },

    // Blind 75 (16-20)
    { id: 16, title: "Product of Array Except Self", difficulty: "Medium", sheet: "blind-75", topic: "Arrays", tags: ["Prefix Sum", "Arrays"] },
    { id: 17, title: "Longest Consecutive Sequence", difficulty: "Medium", sheet: "blind-75", topic: "Hash Table", tags: ["Union Find", "Hash Table"] },
    { id: 18, title: "Valid Palindrome", difficulty: "Easy", sheet: "blind-75", topic: "Strings", tags: ["Two Pointers", "String"] },
    { id: 19, title: "3Sum", difficulty: "Medium", sheet: "blind-75", topic: "Arrays", tags: ["Two Pointers", "Sorting", "Arrays"] },
    { id: 20, title: "Container With Most Water", difficulty: "Medium", sheet: "blind-75", topic: "Arrays", tags: ["Two Pointers", "Greedy"] },

    // GFG Must Do (21-25)
    { id: 21, title: "Missing Number", difficulty: "Easy", sheet: "gfg-must-do", topic: "Math", tags: ["Bit Manipulation", "Math"] },
    { id: 22, title: "Leaders in Array", difficulty: "Easy", sheet: "gfg-must-do", topic: "Arrays", tags: ["Arrays", "Scan"] },
    { id: 23, title: "Equilibrium Point", difficulty: "Easy", sheet: "gfg-must-do", topic: "Arrays", tags: ["Prefix Sum", "Arrays"] },
    { id: 24, title: "Subarray with given sum", difficulty: "Medium", sheet: "gfg-must-do", topic: "Sliding Window", tags: ["Sliding Window", "Arrays"] },
    { id: 25, title: "Sort an array of 0s, 1s", difficulty: "Easy", sheet: "gfg-must-do", topic: "Sorting", tags: ["Sorting", "Arrays"] },

    // Apna College (26-30)
    { id: 26, title: "Max Subarray Sum", difficulty: "Easy", sheet: "apna-college", topic: "Dynamic Programming", tags: ["DP", "Arrays"] },
    { id: 27, title: "Chocolate Distribution", difficulty: "Easy", sheet: "apna-college", topic: "Greedy", tags: ["Greedy", "Sorting"] },
    { id: 28, title: "Search in Rotated Sorted Array", difficulty: "Medium", sheet: "apna-college", topic: "Binary Search", tags: ["Binary Search", "Arrays"] },
    { id: 29, title: "Next Permutation", difficulty: "Medium", sheet: "apna-college", topic: "Arrays", tags: ["Two Pointers", "Math"] },
    { id: 30, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", sheet: "apna-college", topic: "Greedy", tags: ["Greedy", "Optimization"] },
];

export const getDifficultyStats = (solvedIds) => {
    const stats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
    const solvedSet = new Set(solvedIds);

    problems.forEach(p => {
        if (solvedSet.has(p.id)) {
            stats[p.difficulty] = (stats[p.difficulty] || 0) + 1;
            stats.Total++;
        }
    });
    return stats;
};

export const getTopicStats = (solvedIds) => {
    const solvedSet = new Set(solvedIds);
    const topicMap = {};

    problems.forEach(p => {
        const topic = p.topic || 'General';
        if (!topicMap[topic]) {
            topicMap[topic] = { solved: 0, total: 0 };
        }
        topicMap[topic].total++;
        if (solvedSet.has(p.id)) {
            topicMap[topic].solved++;
        }
    });

    return Object.entries(topicMap).map(([topic, data]) => ({
        topic,
        solved: data.solved,
        total: data.total,
        percentage: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
    }));
};