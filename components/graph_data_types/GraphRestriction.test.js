import { GraphRestriction } from "./GraphRestriction.mjs";

describe("constructor", () => {
  test("empty", () => {
    const emptyRestriction = new GraphRestriction();
    expect(emptyRestriction instanceof GraphRestriction).toBeTruthy();
    expect(emptyRestriction.rule).toBe("");
    expect(emptyRestriction.errorMessage).toBe("");
  });

  test("empty strings", () => {
    const emptyStringRestriction = new GraphRestriction("", "");
    expect(emptyStringRestriction instanceof GraphRestriction).toBeTruthy();
    expect(emptyStringRestriction.rule).toBe("");
    expect(emptyStringRestriction.errorMessage).toBe("");
  });
    
  test("actual values", () => {
    const rule = "true", errorMessage = "error message";
    const notEmptyRestriction = new GraphRestriction(rule, errorMessage);
    expect(notEmptyRestriction instanceof GraphRestriction).toBeTruthy();
    expect(notEmptyRestriction.rule).toBe(rule);
    expect(notEmptyRestriction.errorMessage).toBe(errorMessage);
  });
});

describe(".validateRule", () => {
  describe("valid", () => {
    test.each([
      "true",
      "col(1) > 0",
      "col(1) < col(2)",
      "colArr().every(v => v < 10)",
      "colArr().reduce((r, v) => r + v, 0) === 100"
    ])("%p", rule => {
      expect(GraphRestriction.validateRule(rule)).toBeTruthy();
    });
  });

  describe("invalid", () => {
    test.each([
      undefined,
      null,
      1,
      {},
      true,
      false,
      ""
    ])("bad value (%p)", rule => {
      expect(GraphRestriction.validateRule(rule)).toBeFalsy();
    });

    // TODO?
    // test.each([
    //   // TODO
    // ])("bad rule (%p)", rule => {
    //   expect(GraphRestriction.validateRule(rule)).toBeFalsy();
    // });
  });
});

describe(".fromObject", () => {
  test("no object", () => {
    expect(GraphRestriction.fromObject(undefined)).toBeUndefined();
    expect(GraphRestriction.fromObject(null)).toBeUndefined();
  });
    
  test("not an object", () => {
    expect(GraphRestriction.fromObject(12345)).toBeUndefined();
    expect(GraphRestriction.fromObject("a string")).toBeUndefined();
  });

  test("bad object", () => {
    expect(GraphRestriction.fromObject({})).toBeUndefined();
    expect(GraphRestriction.fromObject({ a: "b" })).toBeUndefined();
  });
    
  test.each([
    undefined,
    null,
    1,
    {},
    ""
  ])("invalid rule (%p)", rule => {
    expect(GraphRestriction.fromObject({ rule })).toBeUndefined();
  });

  test.each([
    "true",
    "1 + 1 === 2"
  ])("valid rule (%p)", rule => {
    let obj = { rule };
    let restriction = GraphRestriction.fromObject(obj);
    expect(restriction instanceof GraphRestriction).toBeTruthy();
    expect(restriction.rule).toBe(obj.rule);
  });

  describe("graph restriction object", () => {
    let /** @type {string} */ rule,
        /** @type {string} */ errorMessage,
        /** @type {GraphRestriction} */ restriction;

    beforeEach(() => {
      rule = "true";
      errorMessage = "error message";
      restriction = new GraphRestriction(rule, errorMessage);
    });

    test("directly", () => {
      const passedRestriction = GraphRestriction.fromObject(restriction);
      expect(passedRestriction instanceof GraphRestriction).toBeTruthy();
      expect(passedRestriction.rule).toBe(rule);
      expect(passedRestriction.errorMessage).toBe(errorMessage);
    });

    test("via JSON stringification", () => {
      const restrictionString = JSON.stringify(restriction);
      const restrictionObj = JSON.parse(restrictionString);
      const passedRestriction = GraphRestriction.fromObject(restrictionObj);
      expect(passedRestriction instanceof GraphRestriction).toBeTruthy();
      expect(passedRestriction.rule).toBe(rule);
      expect(passedRestriction.errorMessage).toBe(errorMessage);
    });
  });
});

describe("::isValid", () => {
  test.each([
    // hardcoded bool
    [[], "true"],
    [[1], "true"],

    // basic `col`
    [[1, 2, 3], "col(1) < col(2)"],
    [[1, 2, 3], "col(2) < col(3)"],

    // lots of columns
    [Array.from({ length: 100 }).map((_, i) => i), "col(30) < col(78)"],
    [Array.from({ length: 100 }).map(() => 1), "colArr().every(v => v > 0)"],

    // strictly increasing
    [[1, 2, 3], "colArr().every((_, i, a) => i === 0 || a[i - 1] < a[i])"],

    // increasing
    [[1, 2, 2, 3], "colArr().every((_, i, a) => i === 0 || a[i - 1] <= a[i])"]
  ])("given %p, %p is valid", (values, rule) => {
    expect(new GraphRestriction(rule).isValid(values)).toBeTruthy();
  });

  test.each([
    // hardcoded bool
    [[], "false"],
    [[1], "false"],

    // basic `col`
    [[1, 2, 3], "col(1) > col(2)"],
    [[1, 2, 3], "col(2) > col(3)"],

    // lots of columns
    [Array.from({ length: 100 }).map((_, i) => i), "col(30) > col(78)"],
    [Array.from({ length: 100 }).map(() => 1), "colArr().every(v => v < 0)"],

    // strictly increasing
    [[1, 2, 2, 3], "colArr().every((_, i, a) => i === 0 || a[i - 1] < a[i])"]
  ])("given %p, %p is invalid", (values, rule) => {
    expect(new GraphRestriction(rule).isValid(values)).toBeFalsy();
  });

  test.each([
    ["out of range", 0],
    ["out of range", 4],

    ["not a valid number", undefined],
    ["not a valid number", null],
    ["not a valid number", "a"],
    ["not a valid number", {}],
  ])("%p error when `col` index is %p", (partialErrorString, index) => {
    index = String(JSON.stringify(index));
    const restriction = new GraphRestriction(`col(${index})`);
    const graphValues = [1, 2, 3];
    const testFunc = () => restriction.isValid(graphValues);

    expect(testFunc).toThrow(partialErrorString); // test error type
    expect(testFunc).toThrow(index); // test that the error reports the value
  });
});
