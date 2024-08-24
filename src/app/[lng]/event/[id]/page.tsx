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
      if (data?.event.requiresApproval) {
        toast.info(t('events.approvalPending'));
        setApprovalStatus("pending");
      } else {
        setApprovalStatus("approved");
        toast.success(t('events.joinSuccessful'));
      }
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
    <div className="min-h-screen text-white p-4 md:p-12">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">{event.title}</h1>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-lg font-semibold">
            <p className="mb-2">{t('events.description')}:</p>
            <p className="mb-2">{t('events.location')}:</p>
            <p className="mb-2">{t('events.date')}:</p>
            <p className="mb-2">{t('events.maxAttendees')}:</p>
            <p className="mb-2">{t('events.requiresApproval')}:</p>
            <p className="mb-2">{t('events.isVirtual')}:</p>
          </div>
          <div className="text-lg">
            <p className="mb-2">{event.description}</p>
            <p className="mb-2">{event.location}</p>
            <p className="mb-2">{new Date(event.date).toLocaleString()}</p>
            <p className="mb-2">{event.maxAttendees}</p>
            <p className="mb-2">{event.requiresApproval ? t('common.yes') : t('common.no')}</p>
            <p className="mb-2">{event.isVirtual ? t('common.yes') : t('common.no')}</p>
          </div>
        </div>
        {user?.id === event.organizerId ? (
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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