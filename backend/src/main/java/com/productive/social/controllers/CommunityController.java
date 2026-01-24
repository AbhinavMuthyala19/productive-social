package com.productive.social.controllers;

import com.productive.social.dto.community.CommunityDetailResponse;
import com.productive.social.dto.community.CommunityResponse;
import com.productive.social.dto.community.JoinCommunityRequest;
import com.productive.social.dto.community.JoinCommunityResponse;
import com.productive.social.service.CommunityService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;


    // =============================
    // 1️⃣ CURRENT USER (default)
    // =============================
    @GetMapping
    public ResponseEntity<List<CommunityResponse>> getAllCommunities() {
        return ResponseEntity.ok(
                communityService.getAllCommunitiesForCurrentUser()
        );
    }

    // =============================
    // 2️⃣ CURRENT USER (/me)
    // =============================
    @GetMapping("/me")
    public ResponseEntity<List<CommunityResponse>> getMyCommunities() {
        return ResponseEntity.ok(
                communityService.getCommunitiesForCurrentUser()
        );
    }

    // =============================
    // 3️⃣ SPECIFIC USER
    // =============================
    @GetMapping("/user/{userName}")
    public ResponseEntity<List<CommunityResponse>> getCommunitiesForUser(
            @PathVariable String userName) {
    	System.out.print("Entered Controller");

        return ResponseEntity.ok(
                communityService.getCommunitiesForUsername(userName)
        );
    }



    // GET community details
    @GetMapping("/{communityId}")
    public ResponseEntity<CommunityDetailResponse> getCommunityDetails(@PathVariable Long communityId) {
        return ResponseEntity.ok(communityService.getCommunityDetails(communityId));
    }


    // POST join community
    @PostMapping("/join")
    public ResponseEntity<JoinCommunityResponse> joinCommunity(@RequestBody JoinCommunityRequest request) {
        return ResponseEntity.ok(communityService.joinCommunity(request));
    }


    // POST leave community (optional)
    @PostMapping("/{communityId}/leave")
    public ResponseEntity<String> leaveCommunity(@PathVariable Long communityId) {
        return ResponseEntity.ok(communityService.leaveCommunity(communityId));
    }
}
