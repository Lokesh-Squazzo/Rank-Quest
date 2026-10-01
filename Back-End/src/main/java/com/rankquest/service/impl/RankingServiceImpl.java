package com.rankquest.service.impl;

import com.rankquest.dto.UserProfileResponse;
import com.rankquest.model.User;
import com.rankquest.repository.UserRepository;
import com.rankquest.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {

    private final UserRepository userRepository;
    private static final String ADMIN_USERNAME = "admin";

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getGlobalRankings() {
        List<User> topUsers = userRepository.findTop50ByUsernameNotOrderByTotalScoreDesc(ADMIN_USERNAME);
        return topUsers.stream()
                .map(UserProfileResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getCollegeRankings(String college) {
        List<User> topUsers = userRepository.findTop50ByCollegeAndUsernameNotOrderByTotalScoreDesc(college, ADMIN_USERNAME);
        return topUsers.stream()
                .map(UserProfileResponse::new)
                .collect(Collectors.toList());
    }
}
