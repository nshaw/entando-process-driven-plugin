import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withTheme } from 'react-jsonschema-form';
import { Theme as MuiRJSForm } from 'rjsf-material-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CustomEventContext from 'components/common/CustomEventContext';
import JSONFormSkeleton from 'components/common/form/JSONFormSkeleton';
import JSONFormTitle from 'components/common/form/JSONFormTitle';

const styles = {
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  themedForm: {
    '& .MuiInputBase-input.MuiInputBase-inputMultiline': {
      resize: 'vertical',
    },
  },
};

const CompletionForm = ({
  classes,
  loading,
  submitting,
  formSchema,
  formData,
  uiSchema,
  noTitle,
  children,
}) => {
  if (loading) {
    return <JSONFormSkeleton />;
  }

  if (!loading && !formSchema) {
    return i18next.t('messages.warnings.noData');
  }

  const ThemedForm = withTheme(MuiRJSForm);

  const fields = {
    TitleField: !noTitle ? props => <JSONFormTitle {...props} /> : () => <div />,
  };

  return (
    <CustomEventContext.Consumer>
      {({ onSubmitForm }) => (
        <div>
          {loading && <JSONFormSkeleton />}
          {!loading && (
            <ThemedForm
              schema={formSchema}
              uiSchema={uiSchema}
              fields={fields}
              formData={formData}
              className={classes.themedForm}
              onSubmit={e => onSubmitForm(e)}
            >
              {!children ? (
                <div className={classes.actionButtons}>
                  <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                    {i18next.t(submitting ? 'messages.notify.submitting' : 'common.submit')}
                  </Button>
                </div>
              ) : (
                children
              )}
            </ThemedForm>
          )}
        </div>
      )}
    </CustomEventContext.Consumer>
  );
};

CompletionForm.propTypes = {
  classes: PropTypes.shape({
    actionButtons: PropTypes.string,
    divider: PropTypes.string,
    themedForm: PropTypes.string,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  loading: PropTypes.bool,
  submitting: PropTypes.bool,
  formSchema: PropTypes.shape({}),
  formData: PropTypes.shape({}),
  uiSchema: PropTypes.shape({}),
  noTitle: PropTypes.bool,
};

CompletionForm.defaultProps = {
  loading: false,
  submitting: false,
  formSchema: null,
  formData: {},
  uiSchema: {},
  noTitle: false,
  children: null,
};

export default withStyles(styles)(CompletionForm);
