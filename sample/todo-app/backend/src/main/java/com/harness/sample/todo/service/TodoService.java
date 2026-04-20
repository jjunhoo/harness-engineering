package com.harness.sample.todo.service;

import com.harness.sample.todo.domain.Todo;
import com.harness.sample.todo.dto.CreateTodoRequest;
import com.harness.sample.todo.dto.TodoDto;
import com.harness.sample.todo.dto.UpdateTodoRequest;
import com.harness.sample.todo.repository.TodoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TodoService {

  private final TodoRepository todos;

  public TodoService(TodoRepository todos) {
    this.todos = todos;
  }

  @Transactional(readOnly = true)
  public List<TodoDto> list() {
    return todos.findAll().stream().map(TodoDto::from).toList();
  }

  @Transactional
  public TodoDto create(CreateTodoRequest req) {
    Todo t = new Todo();
    t.setTitle(req.title().trim());
    t.setCompleted(false);
    return TodoDto.from(todos.save(t));
  }

  @Transactional
  public TodoDto update(Long id, UpdateTodoRequest req) {
    Todo t = todos.findById(id).orElseThrow(TodoNotFoundException::new);
    if (req.title() != null) {
      t.setTitle(req.title().trim());
    }
    if (req.completed() != null) {
      t.setCompleted(req.completed());
    }
    return TodoDto.from(todos.save(t));
  }

  @Transactional
  public void delete(Long id) {
    if (!todos.existsById(id)) {
      throw new TodoNotFoundException();
    }
    todos.deleteById(id);
  }
}
