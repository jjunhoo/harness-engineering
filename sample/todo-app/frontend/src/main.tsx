import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CalendarPage } from "./CalendarPage";
import { TodoDayPage } from "./TodoDayPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/day/:date" element={<TodoDayPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
