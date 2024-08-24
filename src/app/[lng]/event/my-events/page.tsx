"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { GET_USER_EVENTS, GET_USER_ORGANIZED_EVENTS } from "eventsapp/graphql/eventQueries";
import { Event, User, EventParticipant } from "@prisma/client";
import Header from "eventsapp/components/Header";
import { useUser } from "eventsapp/context/UserProvider";
import EventCard from "eventsapp/components/EventCard";
import { useTranslation } from "../../../i18n/client";

export default function MyEvents({ params: { lng } }: { params: { lng: string } }) {
    const { t } = useTranslation(lng, 'translation');
    const router = useRouter();
    const [filter, setFilter] = useState("attendee");
    const { user } = useUser();
    const { loading: loadingAttendee, error: errorAttendee, data: dataAttendee } = useQuery(GET_USER_EVENTS, {
        variables: {
            userId: user?.id,
            includeOrganizer: true,
            includeParticipants: true,
        },
        skip: !user?.id,
    });
    const { loading: loadingOrganizer, error: errorOrganizer, data: dataOrganizer } = useQuery(GET_USER_ORGANIZED_EVENTS, {
        variables: {
            userId: user?.id,
            includeOrganizer: true,
            includeParticipants: true,
        },
        skip: !user?.id,
    });

    if (loadingAttendee || loadingOrganizer) return <p>{t('events.loading')}</p>;
    if (errorAttendee || errorOrganizer) return <p>{t('events.errorLoading')}</p>;

    const attendeeEvents = dataAttendee?.userEvents ?? [];
    const organizerEvents = dataOrganizer?.userOrganizedEvents ?? [];

    const handleEventClick = (id: number) => {
        router.push(`/${lng}/event/${id}`);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-12 text-white">
            <Header />
            <section className="w-full max-w-5xl">
                <h2 className="text-2xl font-semibold mb-4">{t('header.myEvents')}</h2>
                <div className="flex mb-8 justify-center">
                    <button
                        className={`px-4 py-2 rounded-full mr-2 ${filter === "attendee" ? "bg-green-500" : "bg-gray-700"}`}
                        onClick={() => setFilter("attendee")}
                    >
                        {t('events.attendee')}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${filter === "organizer" ? "bg-green-500" : "bg-gray-700"}`}
                        onClick={() => setFilter("organizer")}
                    >
                        {t('events.organizer')}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filter === "attendee" && attendeeEvents.map((event: Event & { organizer: User, participants: EventParticipant[] }) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => handleEventClick(event.id)}
                        />
                    ))}
                    {filter === "organizer" && organizerEvents.map((event: Event & { organizer: User, participants: EventParticipant[] }) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => handleEventClick(event.id)}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}