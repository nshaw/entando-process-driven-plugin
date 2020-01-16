import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import { DOMAINS } from 'api/constants';
import TaskListContainer from 'components/TaskList/TaskListContainer';
import mockTasks from 'mocks/pda/tasks.json';
import { taskListConfigs as WIDGET_CONFIGS } from 'mocks/app-builder/pages';

describe('<TaskListContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const taskListUrl = `/connections/${connection}/tasks?page=1&pageSize=30`;

    fetch.once(JSON.stringify(WIDGET_CONFIGS)).once(JSON.stringify(mockTasks));

    const { container } = render(<TaskListContainer />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(taskListUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<TaskListContainer />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});