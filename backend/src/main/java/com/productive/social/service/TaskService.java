package com.productive.social.service;

import com.productive.social.dto.task.TaskResponse;
import com.productive.social.dto.task.UpdateTaskProgressRequest;
import com.productive.social.entity.*;
import com.productive.social.exceptions.ForbiddenException;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.community.CommunityNotFoundException;
import com.productive.social.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserTaskProgressRepository userTaskProgressRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final AuthService authService;

    /** -----------------------------------------
     *  Fetch tasks/ syllabus with user progress
     * ----------------------------------------- */
    public List<TaskResponse> getTasksForCommunity(Long communityId) {
        try {
            User user = authService.getCurrentUser();

            Community community = communityRepository.findById(communityId)
                    .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

            boolean isMember = userCommunityRepository.findByUserAndCommunity(user, community).isPresent();
            if (!isMember) {
            	log.warn("User {} attempted to view tasks without joining community {}", user.getId(), communityId);
                throw new ForbiddenException("Join the community to view its syllabus");
            }

            List<Task> tasks = taskRepository.findByCommunityOrderByOrderIndexAsc(community);
            List<UserTaskProgress> progressList = userTaskProgressRepository.findByUser(user);
            
            log.info("Fetched {} tasks for user {} in community {}", tasks.size(), user.getId(), communityId);

            return tasks.stream().map(task -> {
                Optional<UserTaskProgress> matchingProgress =
                        progressList.stream()
                                .filter(up -> up.getTask().getId().equals(task.getId()))
                                .findFirst();

                return TaskResponse.builder()
                        .taskId(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .orderIndex(task.getOrderIndex())
                        .completed(matchingProgress.map(UserTaskProgress::getCompleted).orElse(false))
                        .completedAt(matchingProgress.map(up -> up.getCompletedAt() != null ? up.getCompletedAt().toString() : null).orElse(null))
                        .build();
            }).toList();
        }
        catch (CommunityNotFoundException | ForbiddenException e) {
            throw e;
        }
        catch (Exception e) {
        	log.error("Failed to load tasks for communityId={}", communityId, e);
            throw new InternalServerException("Failed to load tasks");
        }
    }

    /** -----------------------------------------
     *  Update task progress (complete/un-complete)
     * ----------------------------------------- */
    @Transactional
    public String updateTaskProgress(UpdateTaskProgressRequest request) {
        try {
            User user = authService.getCurrentUser();

            Task task = taskRepository.findById(request.getTaskId())
                    .orElseThrow(() -> new NotFoundException("Task not found"));

            Optional<UserTaskProgress> progressOpt =
                    userTaskProgressRepository.findByUserAndTask(user, task);

            if (request.isCompleted()) {

                if (progressOpt.isEmpty()) {
                    UserTaskProgress progress = UserTaskProgress.builder()
                            .user(user)
                            .task(task)
                            .completed(true)
                            .completedAt(LocalDateTime.now())
                            .build();

                    userTaskProgressRepository.save(progress);
                } else {
                    UserTaskProgress progress = progressOpt.get();
                    progress.setCompleted(true);
                    progress.setCompletedAt(LocalDateTime.now());
                    userTaskProgressRepository.save(progress);
                }

                log.info("Task {} marked completed by user {}", task.getId(), user.getId());
                return "Task marked as completed";

            } else {

                if (progressOpt.isPresent()) {
                    UserTaskProgress progress = progressOpt.get();
                    progress.setCompleted(false);
                    progress.setCompletedAt(null);
                    userTaskProgressRepository.save(progress);
                }

                log.info("Task {} marked incomplete by user {}", task.getId(), user.getId());
                return "Task marked as incomplete";
            }
        }
        catch (NotFoundException | ForbiddenException e) {
            throw e;
        }
        catch (Exception e) {
        	log.error("Failed to update task progress for taskId={} by userId={}",
                    request.getTaskId(),
                    authService.getCurrentUser().getId(), 
                    e);
            throw new InternalServerException("Failed to update task progress");
        }
    }
}
