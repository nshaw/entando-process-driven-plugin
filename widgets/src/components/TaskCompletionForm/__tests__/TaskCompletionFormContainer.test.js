import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';
import mockKeycloak from 'mocks/auth/keycloak';

import { DOMAINS } from 'api/constants';
import TaskCompletionFormContainer from 'components/TaskCompletionForm/TaskCompletionFormContainer';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import MOCKED_GET_TASK_RESPONSE from 'mocks/taskDetails/getTask';
import MOCKED_GET_TASK_FORM_RESPONSE from 'mocks/taskCompletionForm/getFormSchema';

mockKeycloak();

describe('<TaskCompletionFormContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const taskId = 'test';
    const taskListUrl = `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}`;

    fetch
      .once(JSON.stringify(WIDGET_CONFIGS.COMPLETION_FORM))
      .once(JSON.stringify(MOCKED_GET_TASK_RESPONSE))
      .once(JSON.stringify(MOCKED_GET_TASK_FORM_RESPONSE.DEFAULT));

    const { container } = render(<TaskCompletionFormContainer taskId={taskId} />);

    await wait(() => expect(fetch.mock.calls.length).toBe(3));

    expect(container).toMatchSnapshot();
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(taskListUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<TaskCompletionFormContainer taskId="1" />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
