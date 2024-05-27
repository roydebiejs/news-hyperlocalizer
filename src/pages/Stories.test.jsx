/* eslint-disable no-undef */
// src/components/Hello.test.js
import { render, screen } from "@testing-library/react";
import Stories from "./Stories";
import { BrowserRouter } from "react-router-dom";

test("Simple test to check if the text 'Zoek op basis van titel' is in the document", () => {
  render(
    <BrowserRouter>
      <Stories />
    </BrowserRouter>
  );
  expect(screen.getByText("Zoek op basis van titel")).toBeInTheDocument();
});
