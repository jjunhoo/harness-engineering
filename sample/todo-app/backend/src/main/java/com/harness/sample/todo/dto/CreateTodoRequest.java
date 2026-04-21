package com.harness.sample.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;

public record CreateTodoRequest(
    @NotBlank @Size(max = 500) String title,
    @NotNull LocalDate scheduledDate,
    @NotNull Instant scheduledAt) {}
