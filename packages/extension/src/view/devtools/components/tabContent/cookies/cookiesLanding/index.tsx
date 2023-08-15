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
import React from 'react';

/**
 * Internal dependencies.
 */
import LandingHeader from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import prepareCookiesCount from '../../../../../../utils/prepareCookiesCount';
import { prepareCookieStatsComponents } from '../../../../../../utils/prepareCookieStatsComponents';

const CookiesLanding = () => {
  const { tabCookies, tabFrames, tabUrl } = useCookieStore(({ state }) => ({
    tabFrames: state.tabFrames,
    tabCookies: state.tabCookies,
    tabUrl: state.tabUrl,
  }));

  const cookieStats = prepareCookiesCount(tabCookies, tabUrl);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="h-full w-full">
      <LandingHeader
        cookieStats={cookieStats}
        cookiesStatsComponents={cookiesStatsComponents}
      />
      <div className="lg:max-w-[729px] mx-auto flex justify-center mt-10 pb-28 px-4">
        <CookiesMatrix
          tabCookies={tabCookies}
          cookiesStatsComponents={cookiesStatsComponents}
          tabFrames={tabFrames}
        />
      </div>
    </div>
  );
};

export default CookiesLanding;
