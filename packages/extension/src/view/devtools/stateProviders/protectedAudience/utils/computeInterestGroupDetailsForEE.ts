/*
 * Copyright 2024 Google LLC
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
 * External dependencies
 */
import type Protocol from 'devtools-protocol';
/**
 * Internal dependencies
 */
import type { ProtectedAudienceContextType } from '../context';

/**
 * This function parses the auction events to get interest group details wherever applicable.
 * @param globalEventsForEE The events to be parsed.
 * @returns The Interest group details for each event.
 */
async function computeInterestGroupDetailsForEE(
  globalEventsForEE: ProtectedAudienceContextType['state']['globalEventsForEE']
) {
  if (!globalEventsForEE) {
    return null;
  }
  const modifiedGlobalEventsForEE = globalEventsForEE;

  const _globalEventsForEE: ProtectedAudienceContextType['state']['globalEventsForEE'] =
    {};

  await Promise.all(
    Object.keys(globalEventsForEE).map(async (key) => {
      modifiedGlobalEventsForEE[key].igGroups = [];

      await Promise.all(
        globalEventsForEE[key].igGroups.map(async (_interestGroupDetails) => {
          try {
            const result = (await chrome.debugger.sendCommand(
              { tabId: chrome.devtools.inspectedWindow.tabId },
              'Storage.getInterestGroupDetails',
              {
                name: _interestGroupDetails.name,
                ownerOrigin: _interestGroupDetails.ownerOrigin,
              }
            )) as Protocol.Storage.GetInterestGroupDetailsResponse;

            _globalEventsForEE[key].igGroups.push({
              ..._interestGroupDetails,
              details: {
                ...(result?.details ?? {}),
              },
            });

            modifiedGlobalEventsForEE[key].igGroups.push({
              ..._interestGroupDetails,
            });
          } catch (error) {
            // suppress error
          }
        })
      );
    })
  );

  await chrome.storage.local.set({
    globalJoinEvents: {
      ...modifiedGlobalEventsForEE,
    },
  });

  return _globalEventsForEE;
}
export default computeInterestGroupDetailsForEE;
