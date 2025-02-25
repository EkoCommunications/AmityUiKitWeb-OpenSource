import './index.css';
import '~/v4/styles/global.css';

import React, { useEffect, useMemo, useState } from 'react';
import useUser from '~/core/hooks/useUser';

import SDKConnectorProviderV3 from '~/core/providers/SDKConnectorProvider';
import SDKConnectorProvider from '~/v4/core/providers/SDKConnectorProvider';
import { SDKContext } from '~/v4/core/providers/SDKProvider';
import { SDKContext as SDKContextV3 } from '~/core/providers/SDKProvider';
import PostRendererProvider from '~/social/providers/PostRendererProvider';
import NavigationProvider from './NavigationProvider';

import ConfigProvider from '~/v4/social/providers/ConfigProvider';
import { ConfirmModal } from '~/v4/core/components/ConfirmModal';
import { ConfirmComponent as LegacyConfirmComponent } from '~/core/components/Confirm';
import { NotificationsContainer } from '~/v4/core/components/Notification';
import { DrawerContainer } from '~/v4/core/components/Drawer';
import { NotificationsContainer as LegacyNotificationsContainer } from '~/core/components/Notification';

import Localization from '~/core/providers/UiKitProvider/Localization';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import buildGlobalTheme from '~/core/providers/UiKitProvider/theme';
import { defaultConfig, Config, CustomizationProvider } from './CustomizationProvider';
import { ThemeProvider } from './ThemeProvider';
import { PageBehavior, PageBehaviorProvider } from './PageBehaviorProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';
import { ConfirmProvider } from '~/v4/core/providers/ConfirmProvider';
import { ConfirmProvider as LegacyConfirmProvider } from '~/core/providers/ConfirmProvider';
import { NotificationProvider, useNotifications } from '~/v4/core/providers/NotificationProvider';
import { DrawerProvider } from '~/v4/core/providers/DrawerProvider';
import { NotificationProvider as LegacyNotificationProvider } from '~/core/providers/NotificationProvider';
import { CustomReactionProvider } from './CustomReactionProvider';
import { AdEngineProvider } from './AdEngineProvider';
import { AdEngine } from '~/v4/core/AdEngine';
import { GlobalFeedProvider } from '~/v4/social/providers/GlobalFeedProvider';
import { PopupProvider } from '~/v4/core/providers/PopupProvider';
import { Popup } from '~/v4/core/components/AriaPopup';
import { CommunitySetupProvider } from '~/v4/social/providers/CommunitySetupProvider';
import { StoryProvider } from '~/v4/social/providers/StoryProvider';

const InternalComponent = ({
  apiKey,
  apiRegion,
  apiEndpoint,
  userId,
  displayName,
  postRendererConfig,
  theme = {},
  children /* TODO localization */,
  socialCommunityCreationButtonVisible,
  pageBehavior,
  onConnectionStatusChange,
  onDisconnected,
  getAuthToken,
  configs,
  activeRoute,
  onRouteChange,
  seoOptimizationEnabled = false,
}: AmityUIKitProviderProps) => {
  const queryClient = new QueryClient();
  const [client, setClient] = useState<Amity.Client | null>(null);
  const currentUser = useUser(userId);

  const { error } = useNotifications();

  const sdkContextValue = useMemo(
    () => ({
      client,
      currentUserId: userId || undefined,
      userRoles: currentUser?.roles || [],
    }),
    [client, userId, currentUser?.roles],
  );

  useEffect(() => {
    const setup = async () => {
      let authToken;

      if (getAuthToken) {
        authToken = await getAuthToken();
      }

      try {
        // Set up the AmityUIKitManager
        AmityUIKitManager.setup({ apiKey, apiRegion, apiEndpoint, seoOptimizationEnabled });

        AdEngine.instance;

        // Register the device and get the client instance
        await AmityUIKitManager.registerDevice(
          userId,
          displayName || userId,
          {
            sessionWillRenewAccessToken: (renewal) => {
              // Handle access token renewal
              if (getAuthToken) {
                getAuthToken().then((newToken) => {
                  renewal.renewWithAuthToken(newToken);
                });
              } else {
                renewal.renew();
              }
            },
          },
          authToken,
          onConnectionStatusChange,
          onDisconnected,
        );

        const newClient = AmityUIKitManager.getClient();
        setClient(newClient);
      } catch (_error) {
        console.error('Error setting up AmityUIKitManager:', _error);
        if (_error instanceof Error) {
          error({
            content: _error.message,
          });
        }
      }
    };

    setup();
  }, [userId, displayName, onConnectionStatusChange, onDisconnected]);

  if (!client) return null;

  return (
    <div className="asc-uikit">
      <QueryClientProvider client={queryClient}>
        <CustomizationProvider initialConfig={configs || defaultConfig}>
          <CustomReactionProvider>
            <AdEngineProvider>
              <SDKContextV3.Provider value={sdkContextValue}>
                <SDKContext.Provider value={sdkContextValue}>
                  <SDKConnectorProviderV3>
                    <SDKConnectorProvider>
                      <ConfigProvider
                        config={{
                          socialCommunityCreationButtonVisible:
                            socialCommunityCreationButtonVisible || true,
                        }}
                      >
                        <PostRendererProvider config={postRendererConfig}>
                          <NavigationProvider
                            activeRoute={activeRoute}
                            onRouteChange={onRouteChange}
                          >
                            <PageBehaviorProvider pageBehavior={pageBehavior}>
                              <StoryProvider>
                                <CommunitySetupProvider>
                                  <DrawerProvider>
                                    <GlobalFeedProvider>
                                      <PopupProvider>
                                        <Popup />
                                        {children}
                                      </PopupProvider>
                                    </GlobalFeedProvider>
                                    <DrawerContainer />
                                  </DrawerProvider>
                                </CommunitySetupProvider>
                              </StoryProvider>
                            </PageBehaviorProvider>
                          </NavigationProvider>
                        </PostRendererProvider>
                      </ConfigProvider>
                    </SDKConnectorProvider>
                  </SDKConnectorProviderV3>
                </SDKContext.Provider>
              </SDKContextV3.Provider>
            </AdEngineProvider>
          </CustomReactionProvider>
        </CustomizationProvider>
      </QueryClientProvider>
    </div>
  );
};

export type AmityUIKitConfig = Config;

export type AmityRoute = {
  route: string;
  id?: string;
};

interface AmityUIKitProviderProps {
  apiKey: string;
  apiRegion: string;
  apiEndpoint?: {
    http?: string;
    mqtt?: string;
  };
  userId: string;
  displayName?: string;
  postRendererConfig?: any;
  theme?: Record<string, unknown>;
  children?: React.ReactNode;
  socialCommunityCreationButtonVisible?: boolean;
  actionHandlers?: {
    onChangePage?: (data: { type: string; [x: string]: string | boolean }) => void;
    onClickCategory?: (categoryId: string) => void;
    onClickCommunity?: (communityId: string) => void;
    onClickUser?: (userId: string) => void;
    onCommunityCreated?: (communityId: string) => void;
    onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
    onEditUser?: (userId: string) => void;
    onMessageUser?: (userId: string) => void;
  };
  pageBehavior?: PageBehavior;
  onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  getAuthToken?: () => Promise<string>;
  configs?: AmityUIKitConfig;
  activeRoute?: AmityRoute;
  onRouteChange?: (route: AmityRoute) => void;
  seoOptimizationEnabled?: boolean;
}

const AmityUIKitProvider: React.FC<AmityUIKitProviderProps> = (props) => {
  return (
    <Localization locale="en">
      <ThemeProvider>
        <StyledThemeProvider theme={buildGlobalTheme(props.theme)}>
          <NotificationProvider>
            <LegacyNotificationProvider>
              <ConfirmProvider>
                <LegacyConfirmProvider>
                  <InternalComponent {...props} />
                  <NotificationsContainer />
                  <LegacyNotificationsContainer />
                  <ConfirmModal />
                  <LegacyConfirmComponent />
                </LegacyConfirmProvider>
              </ConfirmProvider>
            </LegacyNotificationProvider>
          </NotificationProvider>
        </StyledThemeProvider>
      </ThemeProvider>
    </Localization>
  );
};

export default AmityUIKitProvider;
