/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import Stories from "./Stories";
import { BrowserRouter } from "react-router-dom";

test("Simple test to check if the text 'Filter nieuws op naam' is in the document", () => {
  render(
    <BrowserRouter>
      <Stories />
    </BrowserRouter>
  );
  const textElement = screen.getByText(/Filter nieuws op naam/i);
  expect(textElement).toBeInTheDocument();
});
