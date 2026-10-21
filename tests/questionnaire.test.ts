import assert from "node:assert/strict";
import test from "node:test";
import { categories, questions, scoreAnswers } from "../src/lib/questionnaire";

test("ten preference questions cover all twenty categories", () => {
  assert.equal(questions.length, 10);
  assert.equal(categories.length, 20);
  const mapped = new Set(
    questions.flatMap((question) =>
      question.answers.flatMap((answer) => answer.categories),
    ),
  );
  assert.deepEqual([...mapped].sort(), [...categories].sort());
});
test("scoring returns five unique, sorted and deterministic categories", () => {
  const answers = Array(10).fill(0);
  const results = scoreAnswers(answers);
  assert.equal(results.length, 5);
  assert.equal(new Set(results.map((result) => result.category)).size, 5);
  assert.deepEqual(results, scoreAnswers(answers));
  assert.ok(
    results.every(
      (result, index) =>
        index === 0 || results[index - 1].score >= result.score,
    ),
  );
});
test("incomplete and invalid answers are rejected", () => {
  for (const answers of [
    [],
    Array(9).fill(0),
    Array(10).fill(4),
    Array(10).fill(-1),
    Array(10).fill(0.5),
  ]) {
    assert.throws(() => scoreAnswers(answers));
  }
});
