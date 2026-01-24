package com.productive.social.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.productive.social.dao.CommunityDAO;
import com.productive.social.dto.community.CommunityDetailResponse;
import com.productive.social.dto.community.CommunityResponse;
import com.productive.social.dto.community.JoinCommunityRequest;
import com.productive.social.dto.community.JoinCommunityResponse;
import com.productive.social.entity.Community;
import com.productive.social.entity.User;
import com.productive.social.entity.UserCommunity;
import com.productive.social.enums.CommunityFetchType;
import com.productive.social.enums.MembershipStatus;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.community.CommunityNotFoundException;
import com.productive.social.repository.CommunityRepository;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final AuthService authService;
    private final CommunityDAO communityDAO;
    private final StreakService streakService;

 // =====================================================
    // 1️⃣ /communities
    // Gets ALL communities in DB
    // =====================================================
    public List<CommunityResponse> getAllCommunitiesForCurrentUser() {

        Long userId = authService.getCurrentUser().getId();

        return buildCommunityResponse(
                userId,
                CommunityFetchType.ALL
        );
    }

    // =====================================================
    // 2️⃣ /communities/me
    // Gets ONLY joined communities
    // =====================================================
    public List<CommunityResponse> getCommunitiesForCurrentUser() {

        Long userId = authService.getCurrentUser().getId();

        return buildCommunityResponse(
                userId,
                CommunityFetchType.JOINED_ONLY
        );
    }

    // =====================================================
    // 3️⃣ /communities/{username}
    // Gets ONLY joined communities of target user
    // =====================================================
    public List<CommunityResponse> getCommunitiesForUsername(String userName) {
    	System.out.print("Entered Service");

        Long userId = userRepository.findByUsername(userName)
                .orElseThrow(() ->
                        new NotFoundException("User not found")
                )
                .getId();

        return buildCommunityResponse(
                userId,
                CommunityFetchType.JOINED_ONLY
        );
    }

    // =====================================================
    //  CORE GENERIC IMPLEMENTATION
    // =====================================================
    private List<CommunityResponse> buildCommunityResponse(
            Long userId,
            CommunityFetchType fetchType
    ) {

        log.info(
                "Fetching communities. userId={}, fetchType={}",
                userId,
                fetchType
        );

        try {

            // ---------------------------------
            // 1️⃣ Fetch communities from DAO
            // ---------------------------------
            List<Community> communities;

            if (fetchType == CommunityFetchType.ALL) {

                communities = communityDAO.getAllCommunities();

            } else {

                communities =
                        communityDAO.getCommunitiesJoinedByUser(userId);
            }

            log.debug(
                    "Communities loaded. count={}",
                    communities.size()
            );

            // ---------------------------------
            // 2️⃣ Fetch memberships
            // ---------------------------------
            List<UserCommunity> memberships =
                    userCommunityRepository
                            .findByUser_IdAndStatus(
                                    userId,
                                    MembershipStatus.ACTIVE
                            );

            log.debug(
                    "Active memberships found. userId={}, count={}",
                    userId,
                    memberships.size()
            );

            // ---------------------------------
            // 3️⃣ Build streak map
            // ---------------------------------
            Map<Long, Integer> communityStreakMap =
                    memberships.stream()
                            .filter(uc -> uc.getCommunity() != null)
                            .collect(Collectors.toMap(
                                    uc -> uc.getCommunity().getId(),
                                    uc -> {
                                        try {
                                            return streakService
                                                    .calculateEffectiveStreak(uc);
                                        } catch (Exception e) {

                                            log.error(
                                                    "Failed to calculate streak. userId={}, communityId={}",
                                                    userId,
                                                    uc.getCommunity().getId(),
                                                    e
                                            );
                                            return 0;
                                        }
                                    }
                            ));

            // ---------------------------------
            // 4️⃣ Build response
            // ---------------------------------
            List<CommunityResponse> response =
                    communities.stream()
                            .map(c -> {

                            	boolean joined =
                            	        memberships.stream()
                            	                .anyMatch(uc ->
                            	                        uc.getCommunity().getId().equals(c.getId())
                            	                );


                                int memberCount =
                                        communityDAO
                                                .getMemberCount(c.getId());

                                int streak =
                                        communityStreakMap
                                                .getOrDefault(
                                                        c.getId(),
                                                        0
                                                );

                                return CommunityResponse.builder()
                                        .id(c.getId())
                                        .name(c.getName())
                                        .description(c.getDescription())
                                        .joined(joined)
                                        .memberCount(memberCount)
                                        .streak(streak)
                                        .build();
                            })
                            .toList();

            log.info(
                    "Communities response built successfully. count={}",
                    response.size()
            );

            return response;

        } catch (Exception e) {

            log.error(
                    "Failed to load communities. userId={}, fetchType={}",
                    userId,
                    fetchType,
                    e
            );

            throw new InternalServerException(
                    "Failed to load communities"
            );
        }
    }



    /** -----------------------------------------
     *  Join a Community
     * ----------------------------------------- */
    @Transactional
    public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {

        User user = authService.getCurrentUser();

        Community community = communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

        Optional<UserCommunity> record =
                userCommunityRepository.findByUserAndCommunity(user, community);

        if (record.isPresent()) {

            UserCommunity membership = record.get();

            membership.setStatus(MembershipStatus.ACTIVE);

            // ✅ IMPORTANT
            membership.setLastActivityDate(null);

            membership.setCurrentStreak(0);

            // preserve history
            membership.setLongestStreak(
                    membership.getLongestStreak() == null
                            ? 0
                            : membership.getLongestStreak()
            );

            log.info(
                    "User {} re-joined community {}",
                    user.getId(),
                    community.getId()
            );

        } else {

            UserCommunity mapping = UserCommunity.builder()
                    .user(user)
                    .community(community)
                    .status(MembershipStatus.ACTIVE)
                    .currentStreak(0)
                    .longestStreak(0)
                    .lastActivityDate(null)   // ✅ MUST BE NULL
                    .build();

            userCommunityRepository.save(mapping);

            log.info(
                    "User {} joined community {}",
                    user.getId(),
                    community.getId()
            );
        }

        return new JoinCommunityResponse("Successfully joined community");
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
                .streak(membership.map(UserCommunity::getCurrentStreak).orElse(null))
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


            UserCommunity membership = record.get();

            if (membership.getStatus() == MembershipStatus.LEFT) {
                return "You have already left this community";
            }

            // ✅ soft delete
            membership.setStatus(MembershipStatus.LEFT);

            userCommunityRepository.save(membership);

            log.info(
                "User {} left community {}",
                user.getId(),
                communityId
            );

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
