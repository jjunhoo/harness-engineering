package com.harness.sample.todo.service;

public class TodoNotFoundException extends RuntimeException {

  public TodoNotFoundException() {
    super("Todo not found");
  }
}
