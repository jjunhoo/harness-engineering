package com.harness.sample.todo.web;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.harness.sample.todo.dto.CreateTodoRequest;
import com.harness.sample.todo.dto.UpdateTodoRequest;
import java.time.Instant;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TodoControllerTest {

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;

  private static final LocalDate D1 = LocalDate.of(2026, 4, 20);
  private static final LocalDate D2 = LocalDate.of(2026, 4, 21);
  private static final Instant AT1 = Instant.parse("2026-04-20T02:30:00Z");
  private static final Instant AT2 = Instant.parse("2026-04-21T05:00:00Z");

  @Test
  void crudFlow() throws Exception {
    mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));

    mvc.perform(
            post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json.writeValueAsString(new CreateTodoRequest("learn harness", D1, AT1))))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.title").value("learn harness"))
        .andExpect(jsonPath("$.completed").value(false))
        .andExpect(jsonPath("$.scheduledDate").value("2026-04-20"))
        .andExpect(jsonPath("$.scheduledAt").value("2026-04-20T02:30:00Z"));

    mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)));

    mvc.perform(get("/api/todos").param("date", "2026-04-20"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)));
    mvc.perform(get("/api/todos").param("date", "2026-04-21"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(0)));

    mvc.perform(
            put("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new UpdateTodoRequest(null, true, null, null))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.completed").value(true));

    mvc.perform(delete("/api/todos/1")).andExpect(status().isNoContent());
    mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
  }

  @Test
  void listByRange() throws Exception {
    mvc.perform(
            post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new CreateTodoRequest("a", D1, AT1))))
        .andExpect(status().isCreated());
    mvc.perform(
            post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new CreateTodoRequest("b", D2, AT2))))
        .andExpect(status().isCreated());

    mvc.perform(get("/api/todos").param("from", "2026-04-20").param("to", "2026-04-20"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)));
    mvc.perform(get("/api/todos").param("from", "2026-04-20").param("to", "2026-04-21"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)));
  }
}
