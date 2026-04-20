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

  @Test
  void crudFlow() throws Exception {
    mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));

    mvc.perform(
            post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new CreateTodoRequest("learn harness"))))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.title").value("learn harness"))
        .andExpect(jsonPath("$.completed").value(false));

    mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)));

    mvc.perform(
            put("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new UpdateTodoRequest(null, true))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.completed").value(true));

    mvc.perform(delete("/api/todos/1")).andExpect(status().isNoContent());
    mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
  }
}
