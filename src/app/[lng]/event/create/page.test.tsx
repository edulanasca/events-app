import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateEvent from './page';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { CREATE_EVENT } from 'eventsapp/graphql/eventQueries';
import * as nextNavigation from 'next/navigation';
import { act } from 'react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('eventsapp/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header" />,
}));

jest.mock('../../../i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mocks: MockedResponse[] = [
  {
    request: {
      operationName: 'CreateEvent',
      query: CREATE_EVENT,
    },
    variableMatcher: (_) => true,
    result: {
      data: {
        createEvent: {
          id: 1,
          title: 'Test Event',
          description: 'Test Description',
          date: '2024-08-19T17:12:44.557Z',
          location: 'Test Location',
          isVirtual: false,
          maxAttendees: 100,
          requiresApproval: false,
          __typename: 'Event',
        },
      },
    },
    maxUsageCount: 3,
  },
];

describe('CreateEvent Page', () => {
  it('should render the form and submit successfully', async () => {
    const push = jest.fn();
    const refresh = jest.fn();
    jest.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push, refresh } as unknown as ReturnType<typeof useRouter>);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateEvent params={{ lng: 'en' }} />
      </MockedProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/events.title/i), { target: { value: 'Test Event' } });
      fireEvent.change(screen.getByLabelText(/events.description/i), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText(/events.location/i), { target: { value: 'Test Location' } });
      fireEvent.change(screen.getByLabelText(/events.date/i), { target: { value: '2024-08-19T17:12:44.557Z' } });
      fireEvent.change(screen.getByLabelText(/events.maxAttendees/i), { target: { value: '100' } });
      fireEvent.click(screen.getByRole('button', { name: /events.createEvent/i }));
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/event/1');
    });

    expect(screen.getByRole('button', { name: /events.createEvent/i })).toBeInTheDocument();
  });
});