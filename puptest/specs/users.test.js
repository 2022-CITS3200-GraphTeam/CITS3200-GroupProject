import { jest } from "@jest/globals";
import puppeteer from "puppeteer";
import puppeteerSettings from "../../jest-puppeteer.config.mjs"

import graphSetting from "../utils/graphSetting.mjs";
import generateJS from "../actions/generateJS.mjs";

import { GraphDataObject } from "../../components/graph_data_types/GraphDataObject.mjs";
import { decodeObjectStr } from "../../components/js_helper_funcs/encoding.mjs";

// jest.setTimeout(60000);
const githubPageRegex = /import\(\\"https:\/\/cdn\.jsdelivr\.net\/gh\/2022-CITS3200-GraphTeam\/CITS3200-GroupProject@v\d+\.\d+\.\d+\/components\/qualtrics\/injection\.min\.mjs\\"\)/
const encodedGraphDataExtractionRegex = /\(async\s*function\s*injectionLoader\s*\(\s*graphObjStr\s*\)\s*\{.+\}\)\(\\"(.+)\\"\)/

describe("Basic authentication e2e tests", () => {
  let browser, page;
  let settings, testObj;

  beforeAll(async () => {
    browser = await puppeteer.launch(puppeteerSettings.launch);
    const context = browser.defaultBrowserContext();
    // context.overridePermissions("http://127.0.0.1:5500", ["clipboard-read", "clipboard-write"]);
    page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Browser.grantPermissions', {
      origin: "http://127.0.0.1:5500",
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    });
    

    // Set a definite size for the page viewport so view is consistent across browsers
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });

    settings = graphSetting();
    testObj = await generateJS(page);
  });

  describe("set title and x title", () => {
    let clipboardOutput;

    beforeAll(async () => {
      clipboardOutput = await testObj.testJS(settings.title, settings.xTitle);
      // page.waitForTimeout(1000);
    });

    it("import url should point to github", () => {
      expect(clipboardOutput).toMatch(githubPageRegex);
    });

    it("graph data should contain changes", () => {
      const encodedGraphData = encodedGraphDataExtractionRegex.exec(clipboardOutput)[1];
      const graphData = GraphDataObject.fromObject(decodeObjectStr(encodedGraphData));

      // TODO tests based on `graphData`
      expect(graphData.chartConfig.options.plugins.title.text).toMatch(/Sales of the week/);
    });

  });
});
