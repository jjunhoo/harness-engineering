package com.harness.sample.todo.dto;

import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;

public record UpdateTodoRequest(
    @Size(max = 500) String title,
    Boolean completed,
    LocalDate scheduledDate,
    Instant scheduledAt) {}
