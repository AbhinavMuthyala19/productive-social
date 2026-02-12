package com.productive.social.controllers;

import com.productive.social.dto.posts.PostCreateRequest;
import com.productive.social.dto.posts.PostResponse;
import com.productive.social.service.PostService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // ----------------------------------------------------
    // CREATE POST (Text + Optional Images)
    // ----------------------------------------------------
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> createPost(
            @RequestPart("data") PostCreateRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "notes", required = false) List<MultipartFile> notes
    ) throws Exception {

        PostResponse response = postService.createPost(request, images, notes);
        return ResponseEntity.ok(response);
    }


    // ----------------------------------------------------
    // GLOBAL FEED
    // ----------------------------------------------------
    @GetMapping("/feed/global")
    public ResponseEntity<List<PostResponse>> getGlobalFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ResponseEntity.ok(postService.getGlobalFeed(page, pageSize));
    }

    // ----------------------------------------------------
    // COMMUNITY FEED
    // ----------------------------------------------------
    @GetMapping("/feed/community/{communityId}")
    public ResponseEntity<List<PostResponse>> getCommunityFeed(
            @PathVariable Long communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ResponseEntity.ok(postService.getCommunityFeed(communityId, page, pageSize));
    }

    // ----------------------------------------------------
    // USER FEED (CURRENT USER)
    // ----------------------------------------------------
    @GetMapping("/feed/me")
    public ResponseEntity<List<PostResponse>> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ResponseEntity.ok(
                postService.getMyPosts(page, pageSize)
        );
    }

    // ----------------------------------------------------
    // USER FEED (SPECIFIC USER)
    // ----------------------------------------------------
    @GetMapping("/feed/{userName}")
    public ResponseEntity<List<PostResponse>> getUserPosts(
            @PathVariable String userName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ResponseEntity.ok(
                postService.getPostsByUsername(userName, page, pageSize)
        );
    }

    // ----------------------------------------------------
    // LIKE POST
    // ----------------------------------------------------
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long postId) {
        postService.likePost(postId);
        return ResponseEntity.ok().build();
    }

    // ----------------------------------------------------
    // UNLIKE POST
    // ----------------------------------------------------
    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId) {
        postService.unlikePost(postId);
        return ResponseEntity.ok().build();
    }
}
