"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENT_ONLY } from "eventsapp/graphql/eventQueries";
import { JOIN_EVENT, CHECK_APPROVAL_STATUS } from "eventsapp/graphql/eventMutations";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "eventsapp/context/UserProvider";
import Header from "eventsapp/components/Header";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApprovalList from "eventsapp/components/ApprovalList";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const id = params.id.toString();
  const { data, loading, error } = useQuery(GET_EVENT_ONLY, { variables: { id: Number(id) } });
  const [showApprovalList, setShowApprovalList] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "pending" | null>(null);

  const [joinEvent] = useMutation(JOIN_EVENT, {
    variables: { eventId: Number(id) },
    onCompleted: () => {
      toast.info("Your approval is pending.");
      setApprovalStatus("pending");
    }
  });

  const { data: approvalData } = useQuery(CHECK_APPROVAL_STATUS, {
    variables: { eventId: Number(id) },
    skip: !user
  });

  useEffect(() => {
    if (approvalData) {
      setApprovalStatus(approvalData.checkApprovalStatus.approved ? "approved" : "pending");
    }
  }, [approvalData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading event.</p>;

  const event = data.event;
  
  const handleEdit = () => {
    router.push(`/event/edit/${id}`);
  };

  const handleApprovalList = () => {
    setShowApprovalList(prev => !prev);
  };  

  const handleJoinEvent = () => {
    if (!approvalStatus) {
      joinEvent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="mb-4">{event.description}</p>
        <p className="mb-4">Location: {event.location}</p>
        <p className="mb-4">Date: {new Date(Number(event.date)).toISOString()}</p>
        <p className="mb-4">Max Attendees: {event.maxAttendees}</p>
        <p className="mb-4">Requires Approval: {event.requiresApproval ? "Yes" : "No"}</p>
        <p className="mb-4">Is Virtual: {event.isVirtual ? "Yes" : "No"}</p>
        {user?.id === event.organizerId ? (
          <div>
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2"
            >
              Edit Event
            </button>
            {event.requiresApproval && (
              <button
                onClick={handleApprovalList}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Approval List
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleJoinEvent}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onMouseEnter={() => {
              if (approvalStatus === "pending") {
                // Change button text to "Cancel Join"
              }
            }}
            onMouseLeave={() => {
              if (approvalStatus === "pending") {
                // Change button text back to "Approval Pending"
              }
            }}
          >
            {approvalStatus === "approved" ? "Approval Accepted" : approvalStatus === "pending" ? "Approval Pending" : "Join Event"}
          </button>
        )}
        {showApprovalList && <ApprovalList eventId={Number(id)} />}
      </div>
    </div>
  );
}