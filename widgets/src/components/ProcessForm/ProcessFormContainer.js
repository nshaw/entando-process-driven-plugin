import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import CustomEventContext from 'components/common/CustomEventContext';
import WidgetBox from 'components/common/WidgetBox';
import JSONForm from 'components/common/form/JSONForm';
import Notification from 'components/common/Notification';
import { getProcessForm, postProcessForm } from 'api/pda/processes';
import { getPageWidget } from 'api/app-builder/pages';
import withAuth from 'components/common/auth/withAuth';

class ProcessFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      submitting: false,
      formSchema: null,
      errorMessage: '',
    };

    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
    this.fetchSchema = this.fetchSchema.bind(this);
    this.submitProcessForm = this.submitProcessForm.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const config = await this.fetchWidgetConfigs();

      this.setState({ config }, async () => {
        const formSchema = await this.fetchSchema();
        this.setState({ formSchema, loading: false });
      });
    });
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      const { config } = widgetConfigs.payload;
      const settings = (config.settings && JSON.parse(config.settings)) || {};

      const parsedSettings = Object.keys(settings).reduce(
        (acc, settingKey) => ({
          ...acc,
          [settingKey]: JSON.parse(settings[settingKey]),
        }),
        {}
      );

      return {
        ...config,
        settings: parsedSettings,
      };
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  async fetchSchema() {
    const { config } = this.state;

    const connection = (config && config.knowledgeSource) || '';
    const processContainerId = (config && config.process) || '';

    try {
      const formSchema = await getProcessForm(connection, processContainerId);
      return formSchema;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  submitProcessForm(form) {
    this.setState({ submitting: true }, async () => {
      const { config } = this.state;
      const { onSubmitForm } = this.props;

      const connection = (config && config.knowledgeSource) || '';
      const processContainerId = (config && config.process) || '';

      try {
        const response = await postProcessForm(connection, processContainerId, form.formData);
        onSubmitForm({ ...form, response });
      } catch (error) {
        this.handleError(error.message);
      } finally {
        this.setState({ submitting: false });
      }
    });
  }

  handleError(errorMessage) {
    this.setState({ errorMessage });
    const { onError } = this.props;
    onError(errorMessage);
  }

  render() {
    const { loading, formSchema, config, submitting, errorMessage } = this.state;
    const { onError } = this.props;

    const uiSchema = (config && config.settings && config.settings.uiSchema) || {};

    return (
      <CustomEventContext.Provider
        value={{
          onSubmitForm: this.submitProcessForm,
          onError,
        }}
      >
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <WidgetBox>
              <JSONForm
                loading={loading}
                formSchema={formSchema}
                uiSchema={uiSchema}
                submitting={submitting}
              />
            </WidgetBox>
          </Container>
          <Notification message={errorMessage} type="error" onClose={this.closeNotification} />
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

ProcessFormContainer.propTypes = {
  onError: PropTypes.func,
  onSubmitForm: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

ProcessFormContainer.defaultProps = {
  onError: () => {},
  onSubmitForm: () => {},
  pageCode: '',
  frameId: '',
};

export default withAuth(ProcessFormContainer, [
  'process-definition-form-get',
  'process-definition-form-submit',
]);
