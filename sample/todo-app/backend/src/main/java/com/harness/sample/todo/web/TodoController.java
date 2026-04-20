package com.harness.sample.todo.web;

import com.harness.sample.todo.dto.CreateTodoRequest;
import com.harness.sample.todo.dto.TodoDto;
import com.harness.sample.todo.dto.UpdateTodoRequest;
import com.harness.sample.todo.service.TodoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  @GetMapping
  public List<TodoDto> list() {
    return todoService.list();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TodoDto create(@Valid @RequestBody CreateTodoRequest body) {
    return todoService.create(body);
  }

  @PutMapping("/{id}")
  public TodoDto update(@PathVariable Long id, @Valid @RequestBody UpdateTodoRequest body) {
    return todoService.update(id, body);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    todoService.delete(id);
  }
}
