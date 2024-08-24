import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENT_PARTICIPANTS } from "eventsapp/graphql/eventQueries";
import { TOGGLE_PARTICIPANT_APPROVAL } from "eventsapp/graphql/eventMutations";
import { toast } from "react-toastify";
import Switch from "./Switch";
import { EventParticipant, User } from "@prisma/client";
import { useTranslation } from 'react-i18next';

export default function ApprovalList({ eventId }: { eventId: number }) {
  const { t } = useTranslation();

  const { data, loading, error } = useQuery(GET_EVENT_PARTICIPANTS, { variables: { eventId } });
  const [toggleApproval] = useMutation(TOGGLE_PARTICIPANT_APPROVAL);

  const handleSwitchChange = async (id: number, approved: boolean) => {
    try {
      await toggleApproval({ variables: { id, approved } });
      toast.success(t(`approval.${approved ? "approved" : "disapproved"}`));
    } catch (error) {
      toast.error(t('errors.failedToChangeApprovalStatus'));
    }
  };

  if (loading) return <p>{t('events.loading')}</p>;
  if (error) return <p>{t('errors.failedToLoadParticipants')}</p>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">{t('events.approvalList')}</h2>
      <div className="bg-gray-800 p-4 rounded">
        {data.eventParticipants.map((participant: EventParticipant & { user: User }) => (
          <div key={participant.id} className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div>
                <span className="block font-bold">{participant.user.name}</span>
                <span className="block text-sm text-gray-400">{participant.user.email}</span>
              </div>
            </div>
            <Switch
              initialChecked={participant.approved}
              onChange={(checked) => handleSwitchChange(participant.id, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}