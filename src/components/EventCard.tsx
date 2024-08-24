import { Event, EventParticipant, User } from "@prisma/client";
import { useTranslation } from 'react-i18next';

interface EventCardProps {
  event: Event & { organizer: User, participants: EventParticipant[] };
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const { t } = useTranslation();

  return (
    <button className="max-w-sm rounded overflow-hidden shadow-lg border border-white" style={{ backgroundColor: 'transparent' }} onClick={onClick}>
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm">{event.location}</span>
        </div>
        <div className="text-white text-base font-bold text-xl mb-2">{event.title}</div>
        <p className="text-white text-base">{event.description}</p>
        <p className="text-white text-sm mt-2">{t('events.organizer')}: {event.organizer.name}</p>
        {event.requiresApproval && (
          <p className="text-red-600 text-sm mt-2">{t('events.requiresApproval')}</p>
        )}
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-white text-sm">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-white text-sm">{new Date(event.date).toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center">
          <p className="text-white text-sm mr-2">{t('events.attendees')}:</p>
          <p className="text-white text-sm">{event.participants?.length ?? 0} / {event.maxAttendees}</p>
        </div>
      </div>
    </button>
  );
}