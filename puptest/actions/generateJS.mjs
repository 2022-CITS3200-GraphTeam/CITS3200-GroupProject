class generateJS {
  constructor(page) {
    this.url = "http://127.0.0.1:5500/templates/admin_interface.html";
    this.page = page;
    this.title = "#title";
    this.xTitle = "#xTitle";
    this.yTitle = "#yTitle";
    this.scaleMax = "#scaleMax";
    this.scaleMin = "#scaleMin";
    this.scaleInc = "#scaleIncrement";
    this.stepSize = "#stepSize";
    this.totalSum = "#totalSum";
    this.submitButton = "#submitButton";
  }
  async testJS(
    newTitle,
    newXTitle,
    newYTitle,
    newMax,
    newMin,
    newScaleInc,
    newStepSize,
    newTotalSum
  ) {
    await this.page.goto(this.url);

    await this.page.$eval(this.title, (el) => (el.value = ""));
    await this.page.type(this.title, newTitle);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.xTitle, (el) => (el.value = ""));
    await this.page.type(this.xTitle, newXTitle);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.yTitle, (el) => (el.value = ""));
    await this.page.type(this.yTitle, newYTitle);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.scaleMax, (el) => (el.value = ""));
    await this.page.type(this.scaleMax, newMax);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.scaleMin, (el) => (el.value = ""));
    await this.page.type(this.scaleMin, newMin);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.scaleInc, (el) => (el.value = ""));
    await this.page.type(this.scaleInc, newScaleInc);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.stepSize, (el) => (el.value = ""));
    await this.page.type(this.stepSize, newStepSize);
    await this.page.waitForTimeout(1000);

    await this.page.$eval(this.totalSum, (el) => (el.value = ""));
    await this.page.type(this.totalSum, newTotalSum);
    await this.page.waitForTimeout(1000);

    this.page.on("dialog", async (dialog) => {
      //accept alert
      await dialog.accept();
    });

    await this.page.click(this.submitButton);
    await this.page.waitForTimeout(1000);

    const scriptJS = await this.page.evaluate(() =>
      navigator.clipboard.readText()
    );
    return scriptJS;
  }
}

export default (page) => new generateJS(page);
