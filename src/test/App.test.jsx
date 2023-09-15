import { test, expect, beforeAll, afterAll } from "vitest";
import {
  // findAllByTestId,
  // getByRole,
  render,
  screen,
  // waitFor,
  // within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import App from "../App";
import words from "./words.json";

const server = setupServer(
  rest.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/tree",
    (_req, res, ctx) => res(ctx.json(words))
  )
);

beforeAll(() => server.listen());

afterAll(() => server.close());

test("test that the placeholder text shows in the input-field", () => {
  render(<App />);
  expect(screen.getByPlaceholderText("Search for...")).to.exist;
});

test("test that the error-text shows when the search field is empty upon search", async () => {
  render(<App />);
  expect(
    screen.queryByText("Search field must not be empty.")
  ).not.toBeInTheDocument();
  const user = userEvent.setup();
  const searchBtn = screen.getByRole("button");
  user.click(searchBtn);
  expect(screen.queryByText("Search field must not be empty."));
});

test("test that the error-text shows when the word is not found in the dictionary", async () => {
  render(<App />);
  expect(
    screen.queryByText("Word not found in dictionary.")
  ).not.toBeInTheDocument();
  const user = userEvent.setup();

  const input = screen.getByRole("textbox");
  await user.type(input, "slajdfk");

  const searchBtn = screen.getByRole("button");
  user.click(searchBtn);
});

test("webbapp should display search result after the word tree is written in textbox and searched by click on search button", async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByRole("textbox");
  await user.type(input, "tree");

  const searchBtn = screen.getByRole("button");
  await user.click(searchBtn);

  expect(await screen.findByText("tree")).toBeInTheDocument();
});

test("check if audio exist", async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByRole("textbox");
  await user.type(input, "tree");

  const searchBtn = screen.getByRole("button");
  await user.click(searchBtn);

  const audioElements = await screen.findAllByTestId("audio");
  const audioSource = await screen.findAllByTestId("audio-source");
  expect(audioElements[0]).toBeInTheDocument();
  expect(audioSource[0]).toHaveProperty(
    "src",
    "https://api.dictionaryapi.dev/media/pronunciations/en/tree-uk.mp3"
  );
});
