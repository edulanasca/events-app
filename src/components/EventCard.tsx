import { Event, EventParticipant, User } from "@prisma/client";
import { useTranslation } from 'react-i18next';

interface EventCardProps {
  event: Event & { organizer: User, participants: EventParticipant[] };
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const { t } = useTranslation();

  return (
    <button
      className="border p-4 mb-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between cursor-pointer"
      onClick={onClick}
    >
      <div>
        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
        <p>{event.description}</p>
      </div>
      <div className="mt-4 md:mt-0 md:ml-4">
        <p className="text-right">{t('events.organizer')}: {event.organizer.name}</p>
        <p className="text-right">{t('events.attendees')}: {event.participants?.length ?? 0} / {event.maxAttendees}</p>
      </div>
    </button>
  );
}