/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies.
 */
import dotenv from 'dotenv';
import { Page } from 'puppeteer';

/**
 * Internal dependencies.
 */
import { PuppeteerManagement } from '../../test-utils/puppeteerManagement';
import { Interaction } from '../../test-utils/interaction';

dotenv.config();

describe('Allow Listing', () => {
  let page: Page;
  let puppeteer: PuppeteerManagement;
  let interaction: Interaction;

  beforeEach(async () => {
    puppeteer = new PuppeteerManagement();
    await puppeteer.setup();
    page = await puppeteer.openPage();
  }, 40000);

  afterEach(async () => {
    await puppeteer.close();
  }, 40000);

  test('Should be able to allow list domain.', async () => {
    await puppeteer.navigateToURL(page, 'https://www.hindustantimes.com/');

    const devtools = await puppeteer.getDevtools();
    const key = puppeteer.getCMDKey();
    interaction = new Interaction(devtools, key);

    const frame = await interaction.navigateToCurrentURLCookieFrame(
      page.url().replace(/\/$/, '')
    );

    await interaction.delay(3000);

    const elementHandle = await frame.$('div[title="HTMyOffer"]');

    // Check if first row element is present.
    if (elementHandle) {
      // Right-click on the element
      await elementHandle.click({ button: 'right' });

      await interaction.delay(3000);
      // Click on 'allow-list-option'
      await frame.click('#allow-list-option');
    }
    await interaction.delay(3000);
    const firstrow = await frame.waitForSelector('div[title="HTMyOffer"]');
    await firstrow?.click();

    // Click on the green color background row from table.
    const button = await frame.$(
      'div[data-testid="body-row"][class*="bg-selection-green-dark"], div[data-testid="body-row"] div[style*="color: green"]'
    );

    // Click on the button
    if (button) {
      await button.click();
    }

    await interaction.delay(3000);

    // Assert if allow list text is present in cookie card.
    const cookieCardDiv = await frame.$('[data-testid="cookie-card"]');
    if (cookieCardDiv) {
      const divTextContent = await frame.evaluate(
        (element) => element.textContent,
        cookieCardDiv
      );
      expect(divTextContent).toContain('Allow Listed');
    }
  }, 120000);
});
