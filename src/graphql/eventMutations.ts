import { gql } from "@apollo/client";

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: Int!, $version: Int!, $title: String, $description: String, $date: String, $location: String, $isVirtual: Boolean, $maxAttendees: Int, $requiresApproval: Boolean) {
    editEvent(id: $id, version: $version, title: $title, description: $description, date: $date, location: $location, isVirtual: $isVirtual, maxAttendees: $maxAttendees, requiresApproval: $requiresApproval) {
      id
      title
      description
      version
    }
  }
`;

export const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: Int!) {
    joinEvent(eventId: $eventId) {
      id
      approved
    }
  }
`;

export const CHECK_APPROVAL_STATUS = gql`
  query CheckApprovalStatus($eventId: Int!) {
    checkApprovalStatus(eventId: $eventId) {
      approved
    }
  }
`;

export const TOGGLE_PARTICIPANT_APPROVAL = gql`
  mutation ToggleParticipantApproval($id: Int!, $approved: Boolean!) {
    toggleParticipantApproval(id: $id, approved: $approved) {
      id
      approved
    }
  }
`;