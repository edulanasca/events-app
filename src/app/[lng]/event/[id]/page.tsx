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
import { useTranslation } from "../../../i18n/client";

export default function EventPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'translation');
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
      toast.info(t('events.approvalPending'));
      setApprovalStatus("pending");
    }
  });

  const { data: approvalData } = useQuery(CHECK_APPROVAL_STATUS, {
    variables: { eventId: Number(id) },
    skip: !user
  });

  useEffect(() => {
    if (approvalData?.checkApprovalStatus) {
      setApprovalStatus(approvalData.checkApprovalStatus.approved ? "approved" : "pending");
    }
  }, [approvalData]);

  if (loading) return <p>{t('events.loading')}</p>;
  if (error) return <p>{t('errors.failedToLoadEvents')}</p>;

  const event = data.event;

  const handleEdit = () => {
    router.push(`/${lng}/event/edit/${id}`);
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
        <p className="mb-4">{t('events.location')}: {event.location}</p>
        <p className="mb-4">{t('events.date')}: {new Date(Number(event.date)).toISOString()}</p>
        <p className="mb-4">{t('events.maxAttendees')}: {event.maxAttendees}</p>
        <p className="mb-4">{t('events.requiresApproval')}: {event.requiresApproval ? t('common.yes') : t('common.no')}</p>
        <p className="mb-4">{t('events.isVirtual')}: {event.isVirtual ? t('common.yes') : t('common.no')}</p>
        {user?.id === event.organizerId ? (
          <div>
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2"
            >
              {t('events.editEvent')}
            </button>
            {event.requiresApproval && (
              <button
                onClick={handleApprovalList}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {t('events.approvalList')}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleJoinEvent}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onMouseEnter={(e) => {
              if (approvalStatus == "pending") {
                e.currentTarget.textContent = t('events.cancelJoin');
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.textContent = approvalStatus === "approved" ? t('events.approvalAccepted') : approvalStatus === "pending" ? t('events.approvalPending') : t('events.joinEvent');
            }}
          >
            {approvalStatus === "approved" ? t('events.approvalAccepted') : approvalStatus === "pending" ? t('events.approvalPending') : t('events.joinEvent')}
          </button>
        )}
        {showApprovalList && <ApprovalList eventId={Number(id)} />}
      </div>
    </div>
  );
}