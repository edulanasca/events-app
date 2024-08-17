'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Event, EventParticipant, User } from "@prisma/client";
import Header from "../../components/Header";
import { GET_EVENTS } from "eventsapp/graphql/eventQueries";
import EventCard from "eventsapp/components/EventCard";
import { useRouter } from "next/navigation";
import { useTranslation } from "../i18n/client";

export default function Home({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'translation');
  const router = useRouter();
  const [filter, setFilter] = useState("inPerson");
  const { loading, error, data } = useQuery(GET_EVENTS, {
    variables: {
      includeOrganizer: true,
      includeParticipants: true,
    }
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setErrorMessage(t('errors.failedToLoadEvents'));
    }
  }, [error, t]);

  if (loading) return <p>{t('events.loading')}</p>;

  const filteredEvents = data?.events.filter((event: Event) =>
    filter === "online" ? event.isVirtual : !event.isVirtual
  );

  const handleEventClick = (id: number) => {
    router.push(`/${lng}/event/${id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <Header />

      <section className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">{t('main.latestEvents')}</h2>
        <div className="flex mb-8">
          <button
            className={`px-4 py-2 rounded-full mr-2 ${filter === "inPerson" ? "bg-green-200" : "bg-gray-200"
              }`}
            onClick={() => setFilter("inPerson")}
          >
            {t('events.inPerson')}
          </button>
          <button
            className={`px-4 py-2 rounded-full ${filter === "online" ? "bg-green-200" : "bg-gray-200"
              }`}
            onClick={() => setFilter("online")}
          >
            {t('events.online')}
          </button>
        </div>

        {
          filteredEvents?.map((event: Event & { organizer: User, participants: EventParticipant[] }) =>
            <EventCard key={event.id} event={event} onClick={() => handleEventClick(event.id)} />)
        }
      </section>

      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}