import React from 'react';
import ReactDOM from 'react-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Main from './index';
// import { Spinner } from '@chakra-ui/spinner';
import Welcome from './ui/app/pages/welcome';
import Wallet from './ui/app/pages/wallet';
import { getAccounts } from './api/extension';
import { Box } from '@chakra-ui/layout';
import Settings from './ui/app/pages/settings';
import { IonReactRouter } from '@ionic/react-router';
import {
  IonApp,
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonRouterOutlet,
} from '@ionic/react';
import Send from './ui/app/pages/send';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import Theme from './ui/theme';
import StoreProvider from './ui/store';

const App = ({ history, children }) => {
  const route = useStoreState((state) => state.globalModel.routeStore.route);
  const setRoute = useStoreActions(
    (actions) => actions.globalModel.routeStore.setRoute
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const init = async () => {
    const hasWallet = await getAccounts();
    if (hasWallet) {
      history.push('/wallet');
      // Set route from localStorage if available
      if (route && route !== '/wallet') {
        route
          .slice(1)
          .split('/')
          .reduce((acc, r) => {
            const fullRoute = acc + `/${r}`;
            history.push(fullRoute);
            return fullRoute;
          }, '');
      }
    } else {
      history.push('/welcome');
    }
    setIsLoading(false);
  };
  React.useEffect(() => {
    init();
    history.listen(() => {
      setRoute(history.location.pathname);
    });
  }, []);

  return <>{children}</>;
};

const CustomRoute = ({ children, ...props }) => {
  return (
    <Route
      {...props}
      render={(props) => {
        return <App {...props}>{children}</App>;
      }}
    />
  );
};

const Routes = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <CustomRoute exact path="/">
            <IonPage>
              <IonHeader></IonHeader>
              <IonContent>
                <IonButton fill="clear">Start</IonButton>
              </IonContent>
            </IonPage>
          </CustomRoute>
          <CustomRoute exact path="/wallet">
            <IonPage>
              <IonHeader></IonHeader>
              <IonContent>
                <Wallet />
              </IonContent>
            </IonPage>
          </CustomRoute>
          <CustomRoute exact path="/welcome">
            <IonPage>
              <IonHeader></IonHeader>
              <IonContent>
                <Welcome />
              </IonContent>
            </IonPage>
          </CustomRoute>
          <CustomRoute path="/settings">
            <IonPage>
              <IonContent>
                <Settings />
              </IonContent>
            </IonPage>
          </CustomRoute>
          <CustomRoute exact path="/send">
            <IonPage>
              <IonContent>
                <Send />
              </IonContent>
            </IonPage>
          </CustomRoute>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

defineCustomElements(window);

ReactDOM.render(
  <Theme>
    <StoreProvider>
      <Routes />
    </StoreProvider>
  </Theme>,
  document.getElementById('root')
);

// if (module.hot) module.hot.accept();
