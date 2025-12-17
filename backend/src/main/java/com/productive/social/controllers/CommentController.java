package com.productive.social.controllers;

import com.productive.social.dto.comments.CommentCreateRequest;
import com.productive.social.dto.comments.CommentResponse;
import com.productive.social.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ----------------------------------------------------
    // ADD COMMENT
    // ----------------------------------------------------
    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@RequestBody CommentCreateRequest request) {
        return ResponseEntity.ok(commentService.addComment(request));
    }

    // ----------------------------------------------------
    // GET COMMENTS FOR POST
    // ----------------------------------------------------
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsForPost(postId));
    }
}
