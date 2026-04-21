package com.harness.sample.todo.dto;

import com.harness.sample.todo.domain.Todo;
import java.time.Instant;

public record TodoDto(
    Long id,
    String title,
    boolean completed,
    Instant createdAt,
    String scheduledDate,
    Instant scheduledAt) {

  public static TodoDto from(Todo todo) {
    return new TodoDto(
        todo.getId(),
        todo.getTitle(),
        todo.isCompleted(),
        todo.getCreatedAt(),
        todo.getScheduledDate().toString(),
        todo.getScheduledAt());
  }
}
