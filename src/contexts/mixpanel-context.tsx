/*

All of this code is adapted from the package "react-mixpanel-browser".
Unfortunately, the imports were broken and I couldn't use the package directly,
so I instead imported all of the code and fixed the imports.

GitHub: https://github.com/apancutt/react-mixpanel-browser
Author: @apancutt

*/

import { init, type Config } from "mixpanel-browser";
import { useContext, useMemo, type ProviderProps } from "react";

import { type Mixpanel } from "mixpanel-browser";
import { createContext } from "react";

export type MixpanelContext = Mixpanel | undefined;

export const mixpanelContext = createContext<MixpanelContext>(undefined);

export interface MixpanelProviderProps
  extends Omit<ProviderProps<MixpanelContext>, "value"> {
  config?: Partial<Config>;
  name?: string;
  token?: string;
}

export function MixpanelProvider({
  children,
  config: _config,
  name: _name,
  token,
}: MixpanelProviderProps) {
  const name = useMemo(() => _name ?? "react-mixpanel-browser", [_name]);

  const config = useMemo(
    () => ({
      track_pageview: false, // Rarely makes sense to track page views in React apps
      ..._config,
    }),
    [_config]
  );

  const context = useMemo(
    () => (token ? init(token, config, name) : undefined),
    [config, name, token]
  );

  return (
    <mixpanelContext.Provider value={context}>
      {children}
    </mixpanelContext.Provider>
  );
}

export const useMixpanel = (): MixpanelContext => useContext(mixpanelContext);
