import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENT_PARTICIPANTS } from "eventsapp/graphql/eventQueries";
import { TOGGLE_PARTICIPANT_APPROVAL } from "eventsapp/graphql/eventMutations";
import { toast } from "react-toastify";
import Switch from "./Switch";
import { EventParticipant, User } from "@prisma/client";

export default function ApprovalList({ eventId }: { eventId: number }) {
  const { data, loading, error } = useQuery(GET_EVENT_PARTICIPANTS, { variables: { eventId } });
  const [toggleApproval] = useMutation(TOGGLE_PARTICIPANT_APPROVAL);

  const handleSwitchChange = async (id: number, approved: boolean) => {
    try {
      await toggleApproval({ variables: { id, approved } });
      toast.success(`User ${approved ? "approved" : "disapproved"} successfully.`);
    } catch (error) {
      toast.error("Failed to change approval status.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading participants.</p>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Approval List</h2>
      <div className="bg-gray-800 p-4 rounded">
        {data.eventParticipants.map((participant: EventParticipant & { user: User }) => (
          <div key={participant.id} className="flex items-center justify-between mb-2">
            <span>{participant.user.name}</span>
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