import { jest } from '@jest/globals';

import graphSetting from '../utils/graphSetting.mjs';
import generateJS from '../actions/generateJS.mjs';

jest.setTimeout(60000)

describe('Basic authentication e2e tests', () => {
  let settings;
  beforeAll( async () => {
  // Set a definite size for the page viewport so view is consistent across browsers
    await page.setViewport( {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1
    } );	

    settings = graphSetting('Set');
    generateJS = await generateJS(page);

    } );

  it( 'Should generate the question JS', async () => {
    const sampleJS = await generateJS.testJS(settings.title, settings.xTitle);
    page.waitFor(1000);
    expect.anything(sampleJS) 
    })

});