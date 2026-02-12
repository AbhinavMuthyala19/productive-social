package com.productive.social.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "post_notes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "notes_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostNotes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "notes_id", nullable = false)
    private Long notesId;

    @Column(name = "linked_at", nullable = false)
    private LocalDateTime linkedAt;
}