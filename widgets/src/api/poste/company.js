import { METHODS } from 'api/constants';
import getMockedCompanies from 'mocks/company-list/companyList.api';

import MOCKED_FORM_SCHEMA from 'mocks/company-form/formSchema';
import { postResponse as MOCK_FORM_SUBMIT_RESPONSE } from 'mocks/company-form/formData';
import makeRequest from 'api/makeRequest';

export const getUserForm = async () =>
  makeRequest({
    domain: 'https://poste.demo.entando.com',
    uri: `/companies/definitions/registration/form`,
    method: METHODS.GET,
    mockResponse: MOCKED_FORM_SCHEMA,
    useAuthentication: true,
    forceMock: true,
  });

export const postUserForm = async body =>
  makeRequest({
    domain: 'https://poste.demo.entando.com',
    uri: `/companies/definitions/registration/form`,
    method: METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    mockResponse: MOCK_FORM_SUBMIT_RESPONSE,
    useAuthentication: true,
    forceMock: true,
  });

export const getCompanies = async (page = 0, pageSize = 30, sortedColumn, sortOrder, filter) =>
  makeRequest({
    domain: 'https://poste.demo.entando.com',
    uri: `/companies/lists`,
    queryParams: {
      page: page + 1,
      pageSize,
      sort: sortedColumn,
      direction: sortOrder,
      filter,
    },
    method: METHODS.GET,
    mockResponse: getMockedCompanies(page, pageSize, sortedColumn, sortOrder, filter),
    useAuthentication: true,
    forceMock: true,
  });
