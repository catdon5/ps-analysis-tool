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
import { useContextSelector, createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from 'react';

/**
 * Internal dependencies.
 */
import { type StorageValue, emptyTabData } from '../../../localStore';
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

export interface ICookieStoreContext {
  state: StorageValue;
  actions: object;
}

const initialState: ICookieStoreContext = {
  state: emptyTabData,
  actions: {},
};

export const Context = createContext<ICookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<StorageValue>(emptyTabData);

  const changeListener = useCallback(async () => {
    const tabId = await getCurrentTabId();

    if (!tabId) {
      return;
    }

    const tabData = await chrome.storage.local.get();

    setState(tabData[tabId]);
  }, []);

  useEffect(() => {
    chrome.storage.onChanged.addListener(changeListener);
    return () => {
      chrome.storage.onChanged.removeListener(changeListener);
    };
  }, [changeListener]);

  return (
    <Context.Provider value={{ state, actions: {} }}>
      {children}
    </Context.Provider>
  );
};

export function useCookieStore(): ICookieStoreContext;
export function useCookieStore<T>(
  selector: (state: ICookieStoreContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useCookieStore<T>(
  selector: (state: ICookieStoreContext) => T | ICookieStoreContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
