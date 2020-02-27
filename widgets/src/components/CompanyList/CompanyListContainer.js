import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import { DOMAINS, LOCAL } from 'api/constants';
import { getCompanies } from 'api/poste/company';
import { getPageWidget } from 'api/app-builder/pages';
import utils from 'utils';

import { normalizeColumns, normalizeRows } from 'components/CompanyList/normalizeData';
import ErrorNotification from 'components/common/ErrorNotification';
import ErrorComponent from 'components/common/ErrorComponent';
import Table from 'components/common/Table/Table';
import theme from 'theme';

const styles = {
  paper: {
    minHeight: 459,
    position: 'relative',
  },
};

const CustomedTable = withStyles(
  {
    row: {
      '& > td': {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#003dc6',
        textTransform: 'uppercase',
        padding: '20px 10px',
      },
      '& > td h6': {
        color: '#9b9b9b',
        textTransform: 'normal',
      },
      '& > td:first-of-type': {
        borderRadius: '8px 0 0 8px',
        padding: '20px 10px 20px 20px',
      },
      '& > td:last-of-type': {
        borderRadius: '0 8px 8px 0',
        padding: '20px 20px 20px 10px',
      },
    },
  },
  { name: 'CustomedTable' }
)(Table);

class CompanyList extends React.Component {
  state = {
    loading: true,
    columns: [],
    rows: [],
    size: 0,
    connection: {},
    blocker: '',
    errorAlert: null,
    lastPage: false,
  };

  timer = { ref: null };

  componentDidMount = async () => {
    const { lazyLoading, serviceUrl, pageCode, frameId } = this.props;

    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    // force to IT lang
    i18next.changeLanguage('it');

    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'COMPANY_LIST');
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      if (!widgetConfigs.payload) {
        throw new Error('messages.errors.widgetConfig');
      }

      const { config } = widgetConfigs.payload;

      const companyList = lazyLoading ? await getCompanies(0, 10) : await getCompanies();

      if (!companyList.payload) {
        throw new Error('messages.errors.errorResponse');
      }

      if (!companyList.payload.length) {
        this.setState({ blocker: 'taskList.emptyList' });
      } else {
        const rows = normalizeRows(companyList.payload);

        this.setState({
          loading: false,
          columns: normalizeColumns(JSON.parse(config.columns), rows[0]),
          rows,
          lastPage: companyList.metadata.lastPage === 1,
          size: companyList.metadata.size,
          connection: config.knowledgeSource,
        });
      }
    } catch (error) {
      this.handleError(error.message, 'messages.errors.dataLoading');
    }
  };

  componentDidUpdate = prevProps => {
    const { lazyLoading } = this.props;
    if (prevProps.lazyLoading !== lazyLoading) {
      this.updateRows(lazyLoading ? 0 : undefined);
    }
  };

  updateRows = async (
    page,
    rowsPerPage = 10,
    sortedColumn,
    sortedOrder,
    filter,
    callback = () => {},
    withDelay
  ) => {
    if (withDelay) {
      clearTimeout(this.timer.ref);
      await utils.timeout(800, this.timer);
    }

    this.setState({ loading: true });
    try {
      const res = await getCompanies(page, rowsPerPage, sortedColumn, sortedOrder, filter);
      if (!res.payload) {
        throw res.message;
      }

      this.setState({
        rows: normalizeRows(res.payload),
        size: res.metadata.size,
        lastPage: res.metadata.lastPage === 1,
        loading: false,
      });
      callback();
    } catch (error) {
      this.handleError(error, 'messages.errors.dataLoading');
      this.setState({ loading: false });
    }
  };

  closeNotification = () => {
    this.setState({ errorAlert: null });
  };

  handleError(err, blocker = '') {
    const { onError } = this.props;
    onError(err);
    this.setState({
      errorAlert: err.toString(),
      blocker,
    });
  }

  render() {
    const { loading, columns, rows, size, blocker, errorAlert, lastPage } = this.state;
    const { classes, lazyLoading } = this.props;

    let lazyLoadingProps;
    if (lazyLoading) {
      lazyLoadingProps = {
        onChange: this.updateRows,
        size,
        lastPage,
      };
    }

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.paper}>
          {blocker ? (
            <ErrorComponent message={blocker} />
          ) : (
            <CustomedTable
              loading={loading}
              columns={columns}
              rows={rows}
              lazyLoadingProps={lazyLoadingProps}
              separateRows
              hideColumnHead
              hidePagination
            />
          )}
        </div>
        <ErrorNotification message={errorAlert} onClose={this.closeNotification} />
      </ThemeProvider>
    );
  }
}

CompanyList.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }),
  lazyLoading: PropTypes.bool,
  onError: PropTypes.func,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

CompanyList.defaultProps = {
  classes: {},
  lazyLoading: true,
  onError: () => {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
};

export default withStyles(styles)(CompanyList);
