import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { StripeProvider, Elements } from "react-stripe-elements";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  useMutation,
} from "@apollo/client";
import { Affix, Spin, Layout } from "antd";
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  Stripe,
  User,
} from "./sections";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

const httpLink = new HttpLink({ uri: "/api" });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data?.logIn) {
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }

      setViewer(data.logIn);
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching TinyHouse" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  return (
    <StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
      <Router>
        <Layout id="app">
          {logInErrorBannerElement}
          <Affix offsetTop={0} className="app__affix-header">
            <AppHeader viewer={viewer} setViewer={setViewer} />
          </Affix>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/host">
              <Host viewer={viewer} />
            </Route>
            <Route exact path="/listing/:id">
              <Elements>
                <Listing viewer={viewer} />
              </Elements>
            </Route>
            <Route exact path="/listings/:location?">
              <Listings />
            </Route>
            <Route exact path="/login">
              <Login setViewer={setViewer} />
            </Route>
            <Route exact path="/stripe">
              <Stripe viewer={viewer} setViewer={setViewer} />
            </Route>
            <Route exact path="/user/:id">
              <User viewer={viewer} setViewer={setViewer} />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </StripeProvider>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

reportWebVitals();
