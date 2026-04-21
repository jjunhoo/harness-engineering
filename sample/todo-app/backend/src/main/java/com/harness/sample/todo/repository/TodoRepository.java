package com.harness.sample.todo.repository;

import com.harness.sample.todo.domain.Todo;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {

  List<Todo> findByScheduledDateOrderByScheduledAtAscIdAsc(LocalDate scheduledDate);

  List<Todo> findByScheduledDateBetweenOrderByScheduledAtAscIdAsc(
      LocalDate fromInclusive, LocalDate toInclusive);
}
