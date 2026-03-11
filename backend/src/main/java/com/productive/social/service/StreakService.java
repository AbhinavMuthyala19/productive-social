package com.productive.social.service;

import com.productive.social.dao.StreakDAO;
import com.productive.social.entity.*;
import com.productive.social.enums.ActivityType;
import com.productive.social.exceptions.streak.InvalidCommunityMembershipException;
import com.productive.social.exceptions.streak.StreakOperationException;
import com.productive.social.repository.UserActivityLogRepository;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.util.TimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserActivityLogRepository activityLogRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final StreakDAO streakDAO;

    // ------------------------------------------------
    // PUBLIC ENTRY POINT
    // ------------------------------------------------

    @Transactional
    public void recordActivity(
            User user,
            Community community,
            ActivityType activityType
    ) {

        try {

            UserCommunity membership = streakDAO
                    .findMembership(user.getId(), community.getId())
                    .orElseThrow(() -> {
                        log.warn(
                                "Streak rejected - user not member. userId={}, communityId={}",
                                user.getId(),
                                community.getId()
                        );
                        return new InvalidCommunityMembershipException(
                                "User is not part of community");
                    });

            if (!membership.getStatus().name().equals("ACTIVE")) {

                log.warn(
                        "Streak rejected - membership not active. userId={}, communityId={}, status={}",
                        user.getId(),
                        community.getId(),
                        membership.getStatus()
                );

                throw new InvalidCommunityMembershipException(
                        "User has left this community");
            }

            LocalDate today = TimeUtil.todayForUser(user.getTimezone());

            log.debug(
                    "Recording activity. userId={}, communityId={}, activityType={}, date={}",
                    user.getId(),
                    community.getId(),
                    activityType,
                    today
            );

            // -------------------------
            // 1. INSERT ACTIVITY LOG
            // -------------------------

            activityLogRepository.save(
                    UserActivityLog.builder()
                            .user(user)
                            .community(community)
                            .activityType(activityType)
                            .activityDate(today)
                            .createdAtUtc(TimeUtil.nowUtc())
                            .build()
            );

            log.debug(
                    "Activity log inserted. userId={}, communityId={}, activityType={}",
                    user.getId(),
                    community.getId(),
                    activityType
            );

            // -------------------------
            // 2. UPDATE STREAK SNAPSHOT
            // -------------------------

            updateStreak(membership, today);

        } catch (InvalidCommunityMembershipException e) {

            log.warn(
                    "Streak operation rejected. userId={}, communityId={}, reason={}",
                    user.getId(),
                    community.getId(),
                    e.getMessage()
            );

            throw e;

        } catch (Exception e) {

            log.error(
                    "Unexpected error while recording streak activity. userId={}, communityId={}",
                    user.getId(),
                    community.getId(),
                    e
            );

            throw new StreakOperationException(
                    "Failed to record activity for streak", e);
        }
    }

    // ------------------------------------------------
    // STREAK CORE LOGIC
    // ------------------------------------------------

    @Transactional
    private void updateStreak(UserCommunity membership, LocalDate today) {

        try {

            LocalDate lastDate = membership.getLastActivityDate();

            // First activity ever
            if (lastDate == null) {

                membership.setCurrentStreak(1);
                membership.setLongestStreak(1);

                log.debug("First streak activity recorded.");

            }

            // Same day — ignore
            else if (lastDate.isEqual(today)) {

                log.debug(
                        "Duplicate same-day activity ignored. userId={}, communityId={}",
                        membership.getUser().getId(),
                        membership.getCommunity().getId()
                );

                return;
            }

            // Consecutive day
            else if (lastDate.plusDays(1).isEqual(today)) {

                membership.setCurrentStreak(
                        membership.getCurrentStreak() + 1
                );

            }

            // Broken streak
            else {

                membership.setCurrentStreak(1);

            }

            membership.setLastActivityDate(today);

            membership.setLongestStreak(
                    Math.max(
                            membership.getLongestStreak(),
                            membership.getCurrentStreak()
                    )
            );

            userCommunityRepository.save(membership);

            log.info(
                    "Streak updated successfully. userId={}, communityId={}, current={}, longest={}",
                    membership.getUser().getId(),
                    membership.getCommunity().getId(),
                    membership.getCurrentStreak(),
                    membership.getLongestStreak()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to update streak snapshot. userId={}, communityId={}",
                    membership.getUser().getId(),
                    membership.getCommunity().getId(),
                    e
            );

            throw new StreakOperationException(
                    "Failed to update streak snapshot", e);
        }
    }

    // ------------------------------------------------
    // EFFECTIVE STREAK CALCULATION
    // ------------------------------------------------

    public int calculateEffectiveStreak(UserCommunity membership) {

        LocalDate lastDate = membership.getLastActivityDate();

        if (lastDate == null) {
            return 0;
        }

        LocalDate today =
                TimeUtil.todayForUser(
                        membership.getUser().getTimezone()
                );

        long daysGap =
                java.time.temporal.ChronoUnit.DAYS
                        .between(lastDate, today);

        if (daysGap <= 1) {
            return membership.getCurrentStreak();
        }

        return 0;
    }
}
