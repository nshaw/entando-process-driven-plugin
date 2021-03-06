import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { authenticate } from 'api/app-builder/pages';
import WIDGETS_CONFIG from 'mocks/app-builder/widgets';
import SETTINGS from 'mocks/app-builder/pages';
import Menu from 'App/Menu';
import WidgetConfig from 'components/common/WidgetConfig';

import 'App/App.css';

// pages
import TaskDetailsPage from 'pages/task-details/';
import SmartInboxPage from 'pages/smart-inbox/';

// widgets
import Home from 'App/Home';
import ConnectionsContainer from 'components/Connections/ConnectionsContainer';

import TaskListContainer from 'components/TaskList/TaskListContainer';
import TaskListConfig from 'components/TaskList/TaskListConfig';
import OvertimeGraphContainer from 'components/OvertimeGraph/OvertimeGraphContainer';
import OvertimeGraphConfig from 'components/OvertimeGraph/OvertimeGraphConfig';

import SummaryCardContainer from 'components/SummaryCard/SummaryCardContainer';
import SummaryCardConfig from 'components/SummaryCard/SummaryCardConfig';

import TaskDetailsContainer from 'components/TaskDetails/TaskDetailsContainer';
import TaskDetailsConfig from 'components/TaskDetails/TaskDetailsConfig';

import TaskCompletionFormContainer from 'components/TaskCompletionForm/TaskCompletionFormContainer';
import TaskCompletionFormConfig from 'components/TaskCompletionForm/TaskCompletionFormConfig';

import TaskCommentsContainer from 'components/TaskComments/TaskCommentsContainer';
import TaskCommentsConfig from 'components/TaskComments/TaskCommentsConfig';

import ProcessFormContainer from 'components/ProcessForm/ProcessFormContainer';
import ProcessFormConfig from 'components/ProcessForm/ProcessFormConfig';

import AttachmentsContainer from 'components/Attachments/AttachmentsContainer';
import AttachmentsConfig from 'components/Attachments/AttachmentsConfig';

import ProcessDefinitionContainer from 'components/ProcessDefinition/ProcessDefinitionContainer';
import ProcessDefinitionConfig from 'components/ProcessDefinition/ProcessDefinitionConfig';

import ProcessListContainer from 'components/ProcessList/ProcessListContainer';
import ProcessListConfig from 'components/ProcessList/ProcessListConfig';

const useStyles = makeStyles(theme => ({
  appBar: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontSize: '1.5rem',
  },
  userAuth: {
    marginLeft: '20px',
  },
}));

function App() {
  const [open, setOpen] = React.useState(false);
  const [lazyLoading, setLazyLoading] = React.useState(true);
  const [skeletonLoading, setSkeletonLoading] = React.useState(false);

  // TODO: Remove when token is managed by wrapper
  React.useEffect(() => {
    async function fetchToken() {
      // temporary fetch token for ease of development
      console.log('Fetching authentication token for ease of development! DEV ONLY'); // eslint-disable-line no-console

      const authentication = await authenticate();
      if (authentication && authentication.access_token) {
        console.log('New authentication token is:', authentication.access_token); // eslint-disable-line no-console
        localStorage.setItem('token', authentication.access_token);
      }
    }
    fetchToken();
  }, []);

  const classes = useStyles();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/task-details-page/">
            <TaskDetailsPage />
          </Route>
          <Route path="/smart-inbox-page/">
            <SmartInboxPage />
          </Route>
          <Route path="/">
            <AppBar position="static" className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setOpen(true)}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h2" className={classes.title}>
                  Entando - PAM Plugin
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={skeletonLoading}
                      onChange={() => setSkeletonLoading(!skeletonLoading)}
                    />
                  }
                  label="Show skeleton"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={lazyLoading} onChange={() => setLazyLoading(!lazyLoading)} />
                  }
                  label="Lazy Loading"
                  labelPlacement="start"
                />
                <user-auth
                  kc-auth-url="http://test-keycloak.51.91.30.184.nip.io/auth"
                  kc-realm="entando"
                  kc-client-id="eti-dig-ex"
                  base-url=""
                  class={classes.userAuth}
                />
              </Toolbar>
            </AppBar>

            <Menu open={open} setOpen={setOpen} />

            <Container className="app-container" maxWidth={false}>
              <Route path="/" exact component={Home} />

              <Route path="/Connections" exact component={ConnectionsContainer} />

              <Route
                path="/TaskList/"
                render={() => (
                  <TaskListContainer
                    lazyLoading={lazyLoading}
                    pageCode={WIDGETS_CONFIG.TASK_LIST.pageCode}
                    frameId={WIDGETS_CONFIG.TASK_LIST.frameId}
                  />
                )}
              />
              <Route
                path="/TaskListConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.TASK_LIST.pageCode}
                    frameId={WIDGETS_CONFIG.TASK_LIST.frameId}
                    // hardcoded config can be passed here as well
                  >
                    <TaskListConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/TaskDetails/"
                render={() => (
                  <TaskDetailsContainer
                    taskId={WIDGETS_CONFIG.TASK_DETAILS.taskId}
                    pageCode={WIDGETS_CONFIG.TASK_DETAILS.pageCode}
                    frameId={WIDGETS_CONFIG.TASK_DETAILS.frameId}
                    widgetCode={WIDGETS_CONFIG.TASK_DETAILS.widgetCode}
                    taskPos="0"
                    groups={SETTINGS.TASK_LIST.payload.config.groups}
                  />
                )}
              />
              <Route
                path="/TaskDetailsConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.TASK_DETAILS.pageCode}
                    frameId={WIDGETS_CONFIG.TASK_DETAILS.frameId}
                  >
                    <TaskDetailsConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/TaskCompletionForm/"
                render={() => (
                  <TaskCompletionFormContainer
                    taskId={WIDGETS_CONFIG.COMPLETION_FORM.taskId}
                    pageCode={WIDGETS_CONFIG.COMPLETION_FORM.pageCode}
                    frameId={WIDGETS_CONFIG.COMPLETION_FORM.frameId}
                    widgetCode={WIDGETS_CONFIG.COMPLETION_FORM.widgetCode}
                  />
                )}
              />
              <Route
                path="/TaskCompletionFormConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.COMPLETION_FORM.pageCode}
                    frameId={WIDGETS_CONFIG.COMPLETION_FORM.frameId}
                  >
                    <TaskCompletionFormConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/TaskComments/"
                render={() => (
                  <TaskCommentsContainer
                    taskId={WIDGETS_CONFIG.TASK_COMMENTS.taskId}
                    pageCode={WIDGETS_CONFIG.TASK_COMMENTS.pageCode}
                    frameId={WIDGETS_CONFIG.TASK_COMMENTS.frameId}
                    widgetCode={WIDGETS_CONFIG.TASK_COMMENTS.widgetCode}
                  />
                )}
              />
              <Route
                path="/TaskCommentsConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.TASK_COMMENTS.pageCode}
                    frameId={WIDGETS_CONFIG.TASK_COMMENTS.frameId}
                  >
                    <TaskCommentsConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/SummaryCard/"
                render={() => (
                  <SummaryCardContainer
                    pageCode={WIDGETS_CONFIG.SUMMARY_CARD.pageCode}
                    frameId={WIDGETS_CONFIG.SUMMARY_CARD.frameId}
                    widgetCode={WIDGETS_CONFIG.SUMMARY_CARD.widgetCode}
                  />
                )}
              />
              <Route
                path="/SummaryCardConfig/"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.SUMMARY_CARD.pageCode}
                    frameId={WIDGETS_CONFIG.SUMMARY_CARD.frameId}
                  >
                    <SummaryCardConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/ProcessForm"
                render={() => (
                  <ProcessFormContainer
                    pageCode={WIDGETS_CONFIG.PROCESS_FORM.pageCode}
                    frameId={WIDGETS_CONFIG.PROCESS_FORM.frameId}
                    widgetCode={WIDGETS_CONFIG.PROCESS_FORM.widgetCode}
                  />
                )}
              />
              <Route
                path="/ProcessFormConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.PROCESS_FORM.pageCode}
                    frameId={WIDGETS_CONFIG.PROCESS_FORM.frameId}
                  >
                    <ProcessFormConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/OvertimeGraph"
                render={() => (
                  <OvertimeGraphContainer
                    pageCode={WIDGETS_CONFIG.OVERTIME_GRAPH.pageCode}
                    frameId={WIDGETS_CONFIG.OVERTIME_GRAPH.frameId}
                    widgetCode={WIDGETS_CONFIG.OVERTIME_GRAPH.widgetCode}
                  />
                )}
              />
              <Route
                path="/OvertimeGraphConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.OVERTIME_GRAPH.pageCode}
                    frameId={WIDGETS_CONFIG.OVERTIME_GRAPH.frameId}
                  >
                    <OvertimeGraphConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/Attachments"
                render={() => (
                  <AttachmentsContainer
                    taskId={WIDGETS_CONFIG.ATTACHMENTS.taskId}
                    pageCode={WIDGETS_CONFIG.ATTACHMENTS.pageCode}
                    frameId={WIDGETS_CONFIG.ATTACHMENTS.frameId}
                    widgetCode={WIDGETS_CONFIG.ATTACHMENTS.widgetCode}
                  />
                )}
              />
              <Route
                path="/AttachmentsConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.ATTACHMENTS.pageCode}
                    frameId={WIDGETS_CONFIG.ATTACHMENTS.frameId}
                  >
                    <AttachmentsConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/ProcessDefinition"
                render={() => (
                  <ProcessDefinitionContainer
                    taskId={WIDGETS_CONFIG.PROCESS_DEFINITION.taskId}
                    pageCode={WIDGETS_CONFIG.PROCESS_DEFINITION.pageCode}
                    frameId={WIDGETS_CONFIG.PROCESS_DEFINITION.frameId}
                    widgetCode={WIDGETS_CONFIG.PROCESS_DEFINITION.widgetCode}
                  />
                )}
              />
              <Route
                path="/ProcessDefinitionConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.PROCESS_DEFINITION.pageCode}
                    frameId={WIDGETS_CONFIG.PROCESS_DEFINITION.frameId}
                  >
                    <ProcessDefinitionConfig />
                  </WidgetConfig>
                )}
              />

              <Route
                path="/ProcessList"
                render={() => (
                  <ProcessListContainer
                    taskId={WIDGETS_CONFIG.PROCESS_LIST.taskId}
                    pageCode={WIDGETS_CONFIG.PROCESS_LIST.pageCode}
                    frameId={WIDGETS_CONFIG.PROCESS_LIST.frameId}
                    widgetCode={WIDGETS_CONFIG.PROCESS_LIST.widgetCode}
                  />
                )}
              />
              <Route
                path="/ProcessListConfig"
                render={() => (
                  <WidgetConfig
                    pageCode={WIDGETS_CONFIG.PROCESS_LIST.pageCode}
                    frameId={WIDGETS_CONFIG.PROCESS_LIST.frameId}
                  >
                    <ProcessListConfig />
                  </WidgetConfig>
                )}
              />
            </Container>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
