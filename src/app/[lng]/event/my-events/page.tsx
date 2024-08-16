"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { GET_USER_EVENTS, GET_USER_ORGANIZED_EVENTS } from "eventsapp/graphql/eventQueries";
import { Event, User, EventParticipant } from "@prisma/client";
import Header from "eventsapp/components/Header";
import { useUser } from "eventsapp/context/UserProvider";
import EventCard from "eventsapp/components/EventCard";

export default function MyEvents() {
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
    const router = useRouter();

    if (loadingAttendee || loadingOrganizer) return <p>Loading...</p>;
    if (errorAttendee || errorOrganizer) return <p>Error loading events.</p>;

    const attendeeEvents = dataAttendee?.userEvents ?? [];
    const organizerEvents = dataOrganizer?.userOrganizedEvents ?? [];

    const handleEventClick = (id: number) => {
        router.push(`/event/${id}`);
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <Header />
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex mb-8">
                    <button
                        className={`px-4 py-2 rounded-full mr-2 ${filter === "attendee" ? "bg-green-200" : "bg-gray-200"}`}
                        onClick={() => setFilter("attendee")}
                    >
                        Attendee
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${filter === "organizer" ? "bg-green-200" : "bg-gray-200"}`}
                        onClick={() => setFilter("organizer")}
                    >
                        Organizer
                    </button>
                </div>
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
        </div>
    );
}