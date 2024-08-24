import { gql } from "@apollo/client";

export const GET_EVENT_ONLY = gql`
  query GetEvent($id: Int!) {
    event(id: $id) {
      id
      title
      description
      date
      location
      isVirtual
      maxAttendees
      requiresApproval
      organizerId
      version
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String
    $date: String
    $location: String
    $isVirtual: Boolean!
    $maxAttendees: Int!
    $requiresApproval: Boolean!
  ) {
    createEvent(
      title: $title
      description: $description
      date: $date
      location: $location
      isVirtual: $isVirtual
      maxAttendees: $maxAttendees
      requiresApproval: $requiresApproval
    ) {
      id
      title
      description
      date
      location
      isVirtual
      maxAttendees
      requiresApproval
    }
  }
`;

export const GET_USER_EVENTS = gql`
  query GetUserEvents(
    $userId: String!
    $includeOrganizer: Boolean! = false
    $includeParticipants: Boolean! = false
    $includeCategories: Boolean! = false
  ) {
    userEvents(
      userId: $userId
      includeOrganizer: $includeOrganizer
      includeParticipants: $includeParticipants
      includeCategories: $includeCategories
    ) {
      id
      title
      description
      date
      location
      isVirtual
      maxAttendees
      requiresApproval
      organizer @include(if: $includeOrganizer) {
        id
        name
        email
      }
      participants @include(if: $includeParticipants) {
        id
        user {
          id
          name
          email
        }
        approved
      }
      categories @include(if: $includeCategories) {
        id
        name
      }
    }
  }
`;

export const GET_USER_ORGANIZED_EVENTS = gql`
  query GetUserOrganizedEvents(
    $userId: String!
    $includeParticipants: Boolean! = false
    $includeCategories: Boolean! = false
    $includeOrganizer: Boolean! = false
  ) {
    userOrganizedEvents(
      userId: $userId
      includeParticipants: $includeParticipants
      includeCategories: $includeCategories
      includeOrganizer: $includeOrganizer
    ) {
      id
      title
      description
      date
      location
      isVirtual
      maxAttendees
      requiresApproval
      participants @include(if: $includeParticipants) {
        id
        user {
          id
          name
          email
        }
        approved
      }
      categories @include(if: $includeCategories) {
        id
        name
      }
      organizer @include(if: $includeOrganizer) {
        id
        name
        email
      }
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents(
    $includeOrganizer: Boolean! = false
    $includeParticipants: Boolean! = false
    $includeCategories: Boolean! = false
    $skip: Int = 0
    $take: Int = 10
  ) {
    events(
      includeOrganizer: $includeOrganizer
      includeParticipants: $includeParticipants
      includeCategories: $includeCategories
      skip: $skip
      take: $take
    ) {
      id
      title
      description
      date
      location
      isVirtual
      maxAttendees
      requiresApproval
      organizer @include(if: $includeOrganizer) {
        id
        name
        email
      }
      participants @include(if: $includeParticipants) {
        id
        user {
          id
          name
          email
        }
        approved
      }
      categories @include(if: $includeCategories) {
        id
        name
      }
    }
  }
`;

export const GET_EVENT_PARTICIPANTS = gql`
  query GetEventParticipants($eventId: Int!) {
    eventParticipants(eventId: $eventId) {
      id
      user {
        id
        name
        email
      }
      approved
    }
  }
`;