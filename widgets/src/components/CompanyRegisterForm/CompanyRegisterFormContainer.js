import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import theme from 'theme';
import CustomEventContext from 'components/common/CustomEventContext';
import JSONForm from 'components/common/form/JSONForm';
import Typography from '@material-ui/core/Typography';
import ErrorNotification from 'components/common/ErrorNotification';
import { getUserForm, postUserForm } from 'api/poste/company';
import { getPageWidget } from 'api/app-builder/pages';
import PDFIcon from '@material-ui/icons/PictureAsPdfRounded';

const styles = {
  root: {
    fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
    lineHeight: '1.5em',
    '& a': {
      color: '#003dc6',
    },
    '& h1': {
      marginBottom: 24,
      color: '#003dc6',
    },
  },
  blue: {
    fontSize: 16,
    color: '#003dc6',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  box: {
    padding: 60,
    '& > p, & > ol': {
      marginBottom: 20,
    },
    '& > button:last-of-type, & button[type=submit]': {
      display: 'block',
      margin: '48px auto 0',
    },
  },
  sidebar: {
    '& h4': {
      color: '#003dc6',
      margin: '16px 0',
      fontWeight: 'bold',
    },
    '& h4:not(:first-of-type)': {
      margin: '32px 0 24px',
    },
    '& ul': {
      listStyle: 'none',
      padding: 0,
    },
    '& ul > li': {
      marginBottom: 24,
    },
    '& ul > li:before': {
      content: '"\\25ba"',
      color: '#003dc6',
      fontSize: 11,
      display: 'inline-block',
      verticalAlign: 'middle',
      width: '1em',
      marginLeft: '-2em',
      marginRight: '1em',
    },
    '& > button': {
      display: 'block',
      width: '100%',
      marginBottom: 24,
      padding: '18px 20px',
    },
  },
};

const CustomedButton = withStyles(
  {
    root: {
      borderRadius: 28,
      textTransform: 'uppercase',
      color: '#003dc6',
      padding: '18px 36px',
      height: 'auto',
      fontSize: 16,
    },
    contained: {
      backgroundColor: '#f0dd00',
    },
    outlined: {
      background: 'none',
      border: '1px solid #f0dd00',
    },
  },
  { name: 'CustomedButton' }
)(Button);

const PDFButton = withStyles({
  root: {
    borderRadius: 5,
    width: 396,
    height: 56,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlined: {
    border: '1px solid rgba(155, 155, 155, 0.25)',
    color: '#000',
  },
})(Button);

class CompanyRegisterFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      submitting: false,
      formSchema: null,
      errorMessage: '',
      page: 0,
    };

    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
    this.fetchSchema = this.fetchSchema.bind(this);
    this.submitRegisterForm = this.submitRegisterForm.bind(this);
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
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'PROCESS_FORM');
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
    try {
      const formSchema = await getUserForm();
      return formSchema;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  submitRegisterForm(form) {
    this.setState({ submitting: true }, async () => {
      const { onSubmitForm } = this.props;

      try {
        const response = await postUserForm(form.formData);
        onSubmitForm({ ...form, response });
        const { actionUrl } = this.props;
        window.location.href = actionUrl;
      } catch (error) {
        this.handleError(error.message);
      } finally {
        this.setState({ submitting: false });
      }
    });
  }

  setPage = page => this.setState({ page });

  handleError(errorMessage) {
    this.setState({ errorMessage });
    const { onError } = this.props;
    onError(errorMessage);
  }

  render() {
    const { loading, formSchema, config, submitting, errorMessage, page } = this.state;
    const { classes, onError } = this.props;

    const uiSchema = (config && config.settings && config.settings.uiSchema) || {};

    const renderSidepage = (
      <Grid item md={4} className={classes.sidebar}>
        <Typography variant="h6" component="h4">
          Domande Frequenti
        </Typography>
        <ul>
          <li>
            Ho compilato il form di registrazione ma il sistema non accetta il codice fiscale.
            Perché?
          </li>
          <li>Ho un problema e devo contattare il servizio clienti. Come posso fare?</li>
          <li>
            Ho inserito nome utente e password, ma non riesco ad accedere alla bacheca. Al terzo
            tentativo il sistema si e bloccato: cosa devo fare?
          </li>
          <li>
            Non riesco a completare la registrazione al sito. Il sistema dice che il mio codice
            fiscale risulta già inserito. Che cosa devo fare?
          </li>
        </ul>
        <Typography variant="h6" component="h4">
          Ti serve aiuto?
        </Typography>
        <CustomedButton variant="outlined">Assistenza Gare</CustomedButton>
        <CustomedButton variant="outlined">Assistenza Albo Fornitori</CustomedButton>
        <CustomedButton variant="outlined">Assistenza OnLine</CustomedButton>
      </Grid>
    );

    const leftContent = !page ? (
      <Grid item md={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Abilitazione
        </Typography>
        <Paper square className={classes.box}>
          <p>
            L'abilitazione al Portale Acquisti consente alle Imprese di accedere all'Area riservata
            del Portale e di partecipare alle procedure gestite telematicamente attraverso lo
            stesso.
          </p>
          <p>
            <strong>Per richiedere l'abilitazione al Portale è necessario:</strong>
          </p>
          <ol>
            <li>
              <strong>Registrarsi</strong> compilando l'apposito "Modulo di registrazione" con
              esplicita accettazione dell'informativa a tutela della Privacy di cui al D.Lgs.
              196/2003;
            </li>
            <li>
              <strong>Prendere visione del "Contratto di registrazione al portale"</strong>{' '}
              disponibile nell'area sottostante;
            </li>
            <li>
              <strong>Inviare</strong> il suddetto <strong>Contratto</strong> debitamente compilato
              e firmato digitalmente all'indirizzo:{' '}
              <a href="mailto:posteprocurement@bravosolution.it">
                <strong>posteprocurement@bravosolution.it</strong>
              </a>
            </li>
          </ol>
          <p>
            Il Contratto dovrá essere sottoscritto dal legale rappresentante o comunque da soggetto
            munito di idonei poteri, corredato da una fotocopia di un valido documento di identitá
            del sottoscrittore e da apposita procura, ove necessario.
          </p>
          <p>
            Ricevuto il contratto e a seguito della verifica positiva dello stesso, si procederá
            all'abilitazione dell'Impresa al Portale.{' '}
            <strong>L'abilitazione verrá notificata a mezzo mail</strong> all'indirizzo comunicato
            dall'Impresa stessa in fase di registrazione.
          </p>
          <p>
            In caso di necessitá le Imprese interessate potranno compilare il Form di assistenza on
            line oppure contattare il Servizio di supporto al numero{' '}
            <strong>+39 02-266002636</strong>.
          </p>
          <p>
            Si rende noto che l'Abilitazione al portale e il servizio di supporto sono completamente
            gratuiti.
          </p>
          <Typography variant="h6" className={classes.blue} gutterBottom>
            PRENDI VISIONE E SCARICA IL CONTRATTO
          </Typography>
          <PDFButton
            variant="outlined"
            startIcon={<PDFIcon />}
          >
            {"Contratto di registrazione al portale.pdf"}
          </PDFButton>
          <CustomedButton onClick={() => this.setPage(1)} variant="contained">
            Compila il Modulo di registrazione
          </CustomedButton>
        </Paper>
      </Grid>
    ) : (
      <Grid item md={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Informazioni sull'Azienda
        </Typography>
        <Paper square className={classes.box}>
          <JSONForm
            loading={loading}
            formSchema={formSchema}
            uiSchema={uiSchema}
            submitting={submitting}
            noTitle
          >
            <CustomedButton type="submit" variant="contained">
              Prosegui
            </CustomedButton>
          </JSONForm>
        </Paper>
      </Grid>
    );

    return (
      <CustomEventContext.Provider
        value={{
          onSubmitForm: this.submitRegisterForm,
          onError,
        }}
      >
        <ThemeProvider theme={theme}>
          <Grid container spacing={10} className={classes.root}>
            {leftContent}
            {renderSidepage}
          </Grid>
          <ErrorNotification message={errorMessage} onClose={this.closeNotification} />
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

CompanyRegisterFormContainer.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    box: PropTypes.string.isRequired,
    blue: PropTypes.string.isRequired,
    sidebar: PropTypes.string.isRequired,
  }).isRequired,
  onError: PropTypes.func,
  onSubmitForm: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
  actionUrl: PropTypes.string,
};

CompanyRegisterFormContainer.defaultProps = {
  onError: () => {},
  onSubmitForm: () => {},
  pageCode: '',
  frameId: '',
  actionUrl: '/',
};

export default withStyles(styles)(CompanyRegisterFormContainer);
