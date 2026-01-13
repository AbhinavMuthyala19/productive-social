package com.productive.social.service;

import com.productive.social.dao.CommunityDAO;
import com.productive.social.dto.community.CommunityDetailResponse;
import com.productive.social.dto.community.CommunityResponse;
import com.productive.social.dto.community.JoinCommunityRequest;
import com.productive.social.dto.community.JoinCommunityResponse;
import com.productive.social.entity.Community;
import com.productive.social.entity.User;
import com.productive.social.entity.UserCommunity;
import com.productive.social.exceptions.UnauthorizedException;
import com.productive.social.exceptions.community.CommunityNotFoundException;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.repository.CommunityRepository;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final AuthService authService;
    private final CommunityDAO communityDAO;

    /** -----------------------------------------
     *  Get All Communities with Joined Status
     * ----------------------------------------- */
    public List<CommunityResponse> getAllCommunitiesForUser() {
        Long userId = authService.getCurrentUser().getId();

        List<Community> communities = communityDAO.getAllCommunities();

        return communities.stream()
                .map(c -> {
                    boolean joined = userCommunityRepository.existsByUserIdAndCommunityId(userId, c.getId());
                    int memberCount = communityDAO.getMemberCount(c.getId());

                    return CommunityResponse.builder()
                            .id(c.getId())
                            .name(c.getName())
                            .description(c.getDescription())
                            .joined(joined)
                            .memberCount(memberCount)
                            .build();
                })
                .toList();
    }

    /** -----------------------------------------
     *  Join a Community
     * ----------------------------------------- */
    @Transactional
    public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {
        try {
            User user = authService.getCurrentUser();
            Community community = communityRepository.findById(request.getCommunityId())
                    .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

            boolean alreadyJoined = userCommunityRepository
                    .findByUserAndCommunity(user, community)
                    .isPresent();

            if (alreadyJoined) {
            	log.info("User {} tried to join community {} again", user.getId(), community.getId());
                return new JoinCommunityResponse("Already joined this community");
            }

            UserCommunity mapping = UserCommunity.builder()
                    .user(user)
                    .community(community)
                    .streak(0)
                    .build();

            userCommunityRepository.save(mapping);
            log.info("User {} joined community {}", user.getId(), community.getId());
            return new JoinCommunityResponse("Successfully joined community");
        }
        catch (CommunityNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
        	log.error("Unexpected error while user joining community", e);
            throw new InternalServerException("Failed to join community");
        }
    }

    /** -----------------------------------------
     *  Get Community Details
     * ----------------------------------------- */
    public CommunityDetailResponse getCommunityDetails(Long communityId) {
        User user = authService.getCurrentUser();

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

        Optional<UserCommunity> membership =
                userCommunityRepository.findByUserAndCommunity(user, community);

        int memberCount = userCommunityRepository.findByUser(user).size(); // placeholder

        return CommunityDetailResponse.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .image(community.getImage())
                .joined(membership.isPresent())
                .streak(membership.map(UserCommunity::getStreak).orElse(null))
                .totalMembers(memberCount)
                .build();
    }

    /** -----------------------------------------
     *  Leave Community
     * ----------------------------------------- */
    @Transactional
    public String leaveCommunity(Long communityId) {
        try {
            User user = authService.getCurrentUser();
            Community community = communityRepository.findById(communityId)
                    .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

            Optional<UserCommunity> record =
                    userCommunityRepository.findByUserAndCommunity(user, community);

            if (record.isEmpty()) {
            	log.info("User {} attempted to leave community {} without being a member", user.getId(), communityId);
                return "You are not part of this community";
            }

            userCommunityRepository.delete(record.get());
            log.info("User {} left community {}", user.getId(), communityId);
            return "Successfully left community";
        }
        catch (CommunityNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
        	log.error("Unexpected error while user leaving community", e);
            throw new InternalServerException("Failed to leave community");
        }
    }
}
