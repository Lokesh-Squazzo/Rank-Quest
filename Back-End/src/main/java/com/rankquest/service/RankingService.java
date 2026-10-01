package com.rankquest.service;

import com.rankquest.dto.UserProfileResponse;
import java.util.List;

public interface RankingService {
    List<UserProfileResponse> getGlobalRankings();
    List<UserProfileResponse> getCollegeRankings(String college);
}
