package com.productive.social.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "task_notes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "notes_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskNotes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "notes_id", nullable = false)
    private Long notesId;

    @Column(name = "linked_at", nullable = false)
    private LocalDateTime linkedAt;
}