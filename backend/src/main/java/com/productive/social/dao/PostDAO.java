package com.productive.social.dao;

import com.productive.social.dto.posts.PostCommunityDTO;
import com.productive.social.dto.posts.PostImageDTO;
import com.productive.social.dto.posts.PostResponse;
import com.productive.social.dto.posts.PostUserDTO;
import com.productive.social.entity.Post;
import com.productive.social.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PostDAO {

    @PersistenceContext
    private final EntityManager entityManager;

    // ----------------------------
    // GLOBAL FEED
    // ----------------------------
    public List<PostResponse> getGlobalFeed(User currentUser, int page, int pageSize) {

        List<Post> posts = entityManager.createQuery("""
                SELECT p FROM Post p
                JOIN FETCH p.user u
                JOIN FETCH p.community c
                ORDER BY p.createdAt DESC
                """, Post.class)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();

        return buildFeedResponse(posts, currentUser);
    }

    // ----------------------------
    // COMMUNITY FEED
    // ----------------------------
    public List<PostResponse> getCommunityFeed(Long communityId, User currentUser, int page, int pageSize) {

        List<Post> posts = entityManager.createQuery("""
                SELECT p FROM Post p
                JOIN FETCH p.user u
                JOIN FETCH p.community c
                WHERE c.id = :cid
                ORDER BY p.createdAt DESC
                """, Post.class)
                .setParameter("cid", communityId)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();

        return buildFeedResponse(posts, currentUser);
    }

    // ----------------------------
    // USER FEED (PROFILE POSTS)
    // ----------------------------
    public List<PostResponse> getUserPosts(Long userId, User currentUser, int page, int pageSize) {

        List<Post> posts = entityManager.createQuery("""
                SELECT p FROM Post p
                JOIN FETCH p.user u
                JOIN FETCH p.community c
                WHERE u.id = :uid
                ORDER BY p.createdAt DESC
                """, Post.class)
                .setParameter("uid", userId)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();

        return buildFeedResponse(posts, currentUser);
    }

    // -------------------------------------------------
    // CORE HELPER: Build aggregated feed response
    // -------------------------------------------------
    private List<PostResponse> buildFeedResponse(List<Post> posts, User currentUser) {

        if (posts.isEmpty()) return Collections.emptyList();

        List<Long> postIds = posts.stream().map(Post::getId).toList();

        // Fetch images
        Map<Long, List<PostImageDTO>> imagesMap = fetchImagesForPosts(postIds);

        // Fetch like counts
        Map<Long, Long> likeCounts = fetchLikeCounts(postIds);

        // Fetch comment counts
        Map<Long, Long> commentCounts = fetchCommentCounts(postIds);

        // Fetch liked by current user status
        Set<Long> likedByUser = fetchPostsLikedByUser(postIds, currentUser);

        // Build PostResponse objects
        return posts.stream().map(post ->
                PostResponse.builder()
                        .postId(post.getId())

                        .user(PostUserDTO.builder()
                                .id(post.getUser().getId())
                                .username(post.getUser().getUsername())
                                .name(post.getUser().getName())
                                .profilePicture(post.getUser().getProfilePicture())
                                .streak(0) // TODO: integrate streak module
                                .build())

                        .community(PostCommunityDTO.builder()
                                .id(post.getCommunity().getId())
                                .name(post.getCommunity().getName())
                                .build())

                        .content(post.getContent())
                        .images(imagesMap.getOrDefault(post.getId(), List.of()))

                        .likesCount(likeCounts.getOrDefault(post.getId(), 0L))
                        .commentsCount(commentCounts.getOrDefault(post.getId(), 0L))
                        .likedByCurrentUser(likedByUser.contains(post.getId()))

                        .createdAt(post.getCreatedAt())
                        .build()
        ).collect(Collectors.toList());
    }

    // ---------------------------------
    // Query: Images for posts
    // ---------------------------------
    private Map<Long, List<PostImageDTO>> fetchImagesForPosts(List<Long> postIds) {

        List<Object[]> rows = entityManager.createQuery("""
                SELECT i.post.id, i.imageUrl, i.ordering
                FROM PostImage i
                WHERE i.post.id IN :ids
                ORDER BY i.ordering ASC
                """, Object[].class)
                .setParameter("ids", postIds)
                .getResultList();

        Map<Long, List<PostImageDTO>> map = new HashMap<>();

        for (Object[] row : rows) {
            Long postId = (Long) row[0];

            map.computeIfAbsent(postId, k -> new ArrayList<>())
                    .add(PostImageDTO.builder()
                            .imageUrl((String) row[1])
                            .ordering((Integer) row[2])
                            .build());
        }

        return map;
    }

    // ---------------------------------
    // Query: Like counts
    // ---------------------------------
    private Map<Long, Long> fetchLikeCounts(List<Long> postIds) {

        List<Object[]> rows = entityManager.createQuery("""
                SELECT pl.post.id, COUNT(pl)
                FROM PostLike pl
                WHERE pl.post.id IN :ids
                GROUP BY pl.post.id
                """, Object[].class)
                .setParameter("ids", postIds)
                .getResultList();

        Map<Long, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            map.put((Long) row[0], (Long) row[1]);
        }
        return map;
    }

    // ---------------------------------
    // Query: Comment counts
    // ---------------------------------
    private Map<Long, Long> fetchCommentCounts(List<Long> postIds) {

        List<Object[]> rows = entityManager.createQuery("""
                SELECT c.post.id, COUNT(c)
                FROM Comment c
                WHERE c.post.id IN :ids
                GROUP BY c.post.id
                """, Object[].class)
                .setParameter("ids", postIds)
                .getResultList();

        Map<Long, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            map.put((Long) row[0], (Long) row[1]);
        }
        return map;
    }

    // ---------------------------------
    // Query: Posts liked by current user
    // ---------------------------------
    private Set<Long> fetchPostsLikedByUser(List<Long> postIds, User user) {

        if (user == null) return Set.of();

        List<Long> rows = entityManager.createQuery("""
                SELECT pl.post.id
                FROM PostLike pl
                WHERE pl.user.id = :uid
                AND pl.post.id IN :ids
                """, Long.class)
                .setParameter("uid", user.getId())
                .setParameter("ids", postIds)
                .getResultList();

        return new HashSet<>(rows);
    }
}
