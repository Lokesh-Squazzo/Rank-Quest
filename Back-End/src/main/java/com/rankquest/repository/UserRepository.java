package com.rankquest.repository;

import com.rankquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);


    List<User> findTop50ByUsernameNotOrderByTotalScoreDesc(String username);

    List<User> findTop50ByCollegeAndUsernameNotOrderByTotalScoreDesc(String college, String username);


}