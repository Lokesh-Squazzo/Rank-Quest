package com.rankquest.util;

import com.rankquest.model.Problem;
import com.rankquest.model.Role;
import com.rankquest.model.User;
import com.rankquest.repository.ProblemRepository;
import com.rankquest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Add All Sheet Problems
        addAllProblems();

        // 2. Create Admin safely
        createDefaultAdmin();
    }

    private void addAllProblems() {
        // --- STRIVER SDE SHEET (IDs 1-5) ---
        createProblemIfNotFound("Set Matrix Zeroes", "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.\n\nYou must do it in place.", "Medium", "50.1%", 15, "[{\"input\": \"[[1,1,1],[1,0,1],[1,1,1]]\", \"output\": \"[[1,0,1],[0,0,0],[1,0,1]]\"}]");
        createProblemIfNotFound("Pascal's Triangle", "Given an integer numRows, return the first numRows of Pascal's triangle.", "Easy", "65.2%", 10, "[{\"input\": \"5\", \"output\": \"[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\"}]");
        createProblemIfNotFound("Next Permutation", "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation.", "Medium", "39.8%", 15, "[{\"input\": \"[1,2,3]\", \"output\": \"[1,3,2]\"}]");
        createProblemIfNotFound("Maximum Subarray", "Given an integer array nums, find the subarray with the largest sum, and return its sum.", "Easy", "50.3%", 10, "[{\"input\": \"[-2,1,-3,4,-1,2,1,-5,4]\", \"output\": \"6\"}]");
        createProblemIfNotFound("Sort Colors", "Given an array nums with n objects colored red, white, or blue, sort them in-place.", "Medium", "58.6%", 15, "[{\"input\": \"[2,0,2,1,1,0]\", \"output\": \"[0,0,1,1,2,2]\"}]");

        // --- LOVE BABBAR 450 (IDs 6-10) ---
        createProblemIfNotFound("Reverse the Array", "Given an array, reverse it in-place.", "Easy", "72.4%", 10, "[{\"input\": \"[1, 2, 3]\", \"output\": \"[3, 2, 1]\"}]");
        createProblemIfNotFound("Find Min and Max", "Find the minimum and maximum element in an array.", "Easy", "68.1%", 10, "[{\"input\": \"[3, 5, 4, 1, 9]\", \"output\": \"Min: 1, Max: 9\"}]");
        createProblemIfNotFound("Kth Smallest Element", "Given an array and a number K, find the Kth smallest element.", "Medium", "45.2%", 15, "[{\"input\": \"[7, 10, 4, 3, 20, 15], K=3\", \"output\": \"7\"}]");
        createProblemIfNotFound("Move Negative Numbers", "Move all negative numbers to the beginning and positive to the end.", "Medium", "52.8%", 15, "[{\"input\": \"[-12, 11, -13, -5, 6, -7, 5, -3, -6]\", \"output\": \"[-12, -13, -5, -7, -3, -6, 11, 6, 5]\"}]");
        createProblemIfNotFound("Union of Two Arrays", "Find the union count of two arrays.", "Easy", "60.5%", 10, "[{\"input\": \"[1, 2, 3], [1, 2]\", \"output\": \"3\"}]");

        // --- NEETCODE 150 (IDs 11-15) ---
        createProblemIfNotFound("Contains Duplicate", "Given an integer array nums, return true if any value appears at least twice.", "Easy", "60.8%", 10, "[{\"input\": \"[1,2,3,1]\", \"output\": \"true\"}]");
        createProblemIfNotFound("Valid Anagram", "Given two strings s and t, return true if t is an anagram of s.", "Easy", "62.4%", 10, "[{\"input\": \"anagram, nagaram\", \"output\": \"true\"}]");
        createProblemIfNotFound("Group Anagrams", "Given an array of strings strs, group the anagrams together.", "Medium", "66.2%", 15, "[{\"input\": \"[\\\"eat\\\",\\\"tea\\\",\\\"tan\\\",\\\"ate\\\",\\\"nat\\\",\\\"bat\\\"]\", \"output\": \"[[\\\"bat\\\"],[\\\"nat\\\",\\\"tan\\\"],[\\\"ate\\\",\\\"eat\\\",\\\"tea\\\"]]\"}]");
        createProblemIfNotFound("Top K Frequent", "Given an integer array nums and an integer k, return the k most frequent elements.", "Medium", "64.1%", 15, "[{\"input\": \"[1,1,1,2,2,3], k=2\", \"output\": \"[1,2]\"}]");
        createProblemIfNotFound("Product Except Self", "Return an array such that output[i] is equal to the product of all elements of nums except nums[i].", "Medium", "64.4%", 15, "[{\"input\": \"[1,2,3,4]\", \"output\": \"[24,12,8,6]\"}]");

        // --- BLIND 75 (IDs 16-20) ---
        createProblemIfNotFound("Best Time to Buy Stock", "Maximize profit by choosing a single day to buy and a different day to sell.", "Easy", "54.2%", 10, "[{\"input\": \"[7,1,5,3,6,4]\", \"output\": \"5\"}]");
        createProblemIfNotFound("Maximum Product Subarray", "Find the contiguous subarray within an array which has the largest product.", "Medium", "34.6%", 15, "[{\"input\": \"[2,3,-2,4]\", \"output\": \"6\"}]");
        createProblemIfNotFound("Find Min in Rotated", "Find the minimum element in a sorted array that has been rotated.", "Medium", "48.3%", 15, "[{\"input\": \"[3,4,5,1,2]\", \"output\": \"1\"}]");
        createProblemIfNotFound("Search in Rotated", "Search for a target value in a rotated sorted array.", "Medium", "38.8%", 15, "[{\"input\": \"[4,5,6,7,0,1,2], target=0\", \"output\": \"4\"}]");
        createProblemIfNotFound("3Sum", "Find all unique triplets in the array which gives the sum of zero.", "Medium", "32.1%", 15, "[{\"input\": \"[-1,0,1,2,-1,-4]\", \"output\": \"[[-1,-1,2],[-1,0,1]]\"}]");

        // --- GFG MUST DO (IDs 21-25) ---
        createProblemIfNotFound("Missing Number", "Find the missing number in an array of size N-1 containing distinct integers from 1 to N.", "Easy", "45.2%", 10, "[{\"input\": \"[1, 2, 3, 5]\", \"output\": \"4\"}]");
        createProblemIfNotFound("Subarray with Given Sum", "Find a continuous subarray which adds to a given number S.", "Easy", "38.4%", 10, "[{\"input\": \"[1,2,3,7,5], S=12\", \"output\": \"[2, 4]\"}]");
        createProblemIfNotFound("Leaders in an Array", "Find elements which are greater than all elements to their right.", "Easy", "40.2%", 10, "[{\"input\": \"[16, 17, 4, 3, 5, 2]\", \"output\": \"[17, 5, 2]\"}]");
        createProblemIfNotFound("Majority Element", "Find the element that appears more than N/2 times.", "Medium", "55.6%", 15, "[{\"input\": \"[3,1,3,3,2]\", \"output\": \"3\"}]");
        createProblemIfNotFound("Equilibrium Point", "Find the point where left sum equals right sum.", "Easy", "48.9%", 10, "[{\"input\": \"[1,3,5,2,2]\", \"output\": \"3\"}]");

        // --- APNA COLLEGE (IDs 26-30) ---
        createProblemIfNotFound("Search Element", "Search for an element in an array.", "Easy", "80.1%", 10, "[{\"input\": \"[1, 2, 3, 4], x=3\", \"output\": \"2\"}]");
        createProblemIfNotFound("Chocolate Distribution", "Minimize the difference between maximum and minimum chocolates given to K students.", "Easy", "58.2%", 10, "[{\"input\": \"[3, 4, 1, 9, 56, 7, 9, 12], m=5\", \"output\": \"6\"}]");
        createProblemIfNotFound("Trapping Rain Water", "Calculate how much water can be trapped between blocks.", "Hard", "42.3%", 20, "[{\"input\": \"[0,1,0,2,1,0,1,3,2,1,2,1]\", \"output\": \"6\"}]");
        createProblemIfNotFound("Spiral Matrix", "Return all elements of the matrix in spiral order.", "Medium", "44.1%", 15, "[{\"input\": \"[[1,2,3],[4,5,6],[7,8,9]]\", \"output\": \"[1,2,3,6,9,8,7,4,5]\"}]");
        createProblemIfNotFound("Search 2D Matrix", "Write an efficient algorithm to search a value in an m x n matrix.", "Medium", "46.5%", 15, "[{\"input\": \"[[1,3,5],[7,10,12]], target=3\", \"output\": \"true\"}]");

        System.out.println("... All 30 Sheet Problems checked/added to database.");
    }

    private void createProblemIfNotFound(String title, String description, String difficulty, String acceptance, int points, String testCases) {
        if (!problemRepository.existsByTitle(title)) {
            Problem p = new Problem(title, description, difficulty, acceptance, points, testCases);
            problemRepository.save(p);
        }
    }

    private void createDefaultAdmin() {
        if (!userRepository.findByEmail("admin@rankquest.com").isPresent()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@rankquest.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
    }
}