package com.harness.sample.todo.dto;

import jakarta.validation.constraints.Size;

public record UpdateTodoRequest(@Size(max = 500) String title, Boolean completed) {}
