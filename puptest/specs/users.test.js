import puppeteer from "puppeteer";
import puppeteerSettings from "../../jest-puppeteer.config.mjs";

import graphSetting from "../utils/graphSetting.mjs";
import generateJS from "../actions/generateJS.mjs";

import { GraphDataObject } from "../../components/graph_data_types/GraphDataObject.mjs";
import { decodeObjectStr } from "../../components/js_helper_funcs/encoding.mjs";

const githubPageRegex =
  /import\(\\"https:\/\/cdn\.jsdelivr\.net\/gh\/2022-CITS3200-GraphTeam\/CITS3200-GroupProject@v\d+\.\d+\.\d+\/components\/qualtrics\/injection\.min\.mjs\\"\)/;
const encodedGraphDataExtractionRegex =
  /\(async\s*function\s*injectionLoader\s*\(\s*graphObjStr\s*\)\s*\{.+\}\)\(\\"(.+)\\"\)/;

describe("Basic authentication e2e tests", () => {
  let browser, page;
  let settings, testObj;

  beforeAll(async () => {
    browser = await puppeteer.launch(puppeteerSettings.launch);
    const context = browser.defaultBrowserContext();
    page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send("Browser.grantPermissions", {
      origin: BASE_URL,
      permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
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
      clipboardOutput = await testObj.testJS(
        settings.newTitle,
        settings.newXTitle,
        settings.newYTitle,
        settings.newMax,
        settings.newMin,
        settings.newScaleInc,
        settings.newStepSize,
        settings.newTotalSum
      );
    });

    it("import url should point to github", () => {
      expect(clipboardOutput).toMatch(githubPageRegex);
    });

    it("graph data should contain input changes", () => {
      const encodedGraphData =
        encodedGraphDataExtractionRegex.exec(clipboardOutput)[1];
      const graphData = GraphDataObject.fromObject(
        decodeObjectStr(encodedGraphData)
      );

      expect(graphData.chartConfig.options.plugins.title.text).toMatch(
        /Sales of the week/
      );
      expect(graphData.chartConfig.options.scales.x.title.text).toMatch(/Day/);
      expect(graphData.chartConfig.options.scales.y.title.text).toMatch(
        /Amount/
      );
      expect(graphData.chartConfig.options.scales.y.max).toEqual(100);
      expect(graphData.chartConfig.options.scales.y.min).toEqual(10);
      expect(graphData.chartConfig.options.scales.y.ticks.stepSize).toEqual(5);
    });
  });
});
