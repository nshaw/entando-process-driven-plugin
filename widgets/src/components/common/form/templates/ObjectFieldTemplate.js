import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  header: {
    fontSize: ({ idSchema }) =>
      idSchema && idSchema.$id && idSchema.$id === 'root' ? '20px' : 'initial',
    marginBottom: ({ idSchema }) =>
      idSchema && idSchema.$id && idSchema.$id === 'root' ? '20px' : 'initial',
  },
  gridContainer: {
    padding: '0px',
  },
  divider: {
    marginTop: '11px',
    marginBottom: '11px',
  },
  description: {
    fontSize: '12px',
    marginBottom: '20px',
  },
  gridItem: {
    padding: '0px',
    marginLeft: ({ uiSchema }) =>
      uiSchema && uiSchema['ui:options'] && uiSchema['ui:options'].group ? '-12px' : 'initial',
    marginRight: ({ uiSchema }) =>
      uiSchema && uiSchema['ui:options'] && uiSchema['ui:options'].group ? '-12px' : 'initial',
  },
});

const generateColumnedOFT = columnSize => {
  const ObjectFieldTemplate = props => {
    const classes = useStyles(props);

    const { title, description, properties, uiSchema, idSchema } = props;

    const objectFieldOptions = (uiSchema && uiSchema['ui:options']) || {};

    const showHeader = !objectFieldOptions.hideHeader && !objectFieldOptions.group;
    const hideDivider =
      objectFieldOptions.hideDivider || (idSchema && idSchema.$id && idSchema.$id === 'root');

    return (
      <div>
        {showHeader && (
          <div className={classes.header}>
            {title}
            {!hideDivider && <Divider className={classes.divider} />}
            {description && <div className={classes.description}>{description}</div>}
          </div>
        )}
        <Grid
          container
          spacing={3}
          direction={objectFieldOptions.direction || 'row'}
          className={classes.gridContainer}
        >
          {properties.map(element => {
            const options =
              (element.content.props &&
                element.content.props.uiSchema &&
                element.content.props.uiSchema['ui:options']) ||
              {};

            const gridItemSize = options.size || columnSize || 12;

            return (
              <Grid item xs={gridItemSize} className={classes.gridItem} key={element.content.key}>
                {element.content}
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  };

  // All available props
  // https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#field-template
  ObjectFieldTemplate.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    uiSchema: PropTypes.shape(),
    idSchema: PropTypes.shape({
      $id: PropTypes.string,
    }),
  };

  ObjectFieldTemplate.defaultProps = {
    description: '',
    title: '',
    uiSchema: {},
    idSchema: {},
  };

  return ObjectFieldTemplate;
};

export default generateColumnedOFT;
