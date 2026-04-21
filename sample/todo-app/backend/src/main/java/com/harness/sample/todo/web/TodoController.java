package com.harness.sample.todo.web;

import com.harness.sample.todo.dto.CreateTodoRequest;
import com.harness.sample.todo.dto.TodoDto;
import com.harness.sample.todo.dto.UpdateTodoRequest;
import com.harness.sample.todo.service.TodoService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  /**
   * @param date 단일 일자 필터 (YYYY-MM-DD)
   * @param from 범위 시작(포함), {@code to}와 함께 사용
   * @param to 범위 끝(포함)
   */
  @GetMapping
  public List<TodoDto> list(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
    if (date != null) {
      return todoService.listByDate(date);
    }
    if (from != null && to != null) {
      return todoService.listBetween(from, to);
    }
    return todoService.listAll();
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
