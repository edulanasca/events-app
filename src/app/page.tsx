'use client';

import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Event } from "@prisma/client";
import Header from "../components/Header";

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      isVirtual
      organizer {
        name
      }
    }
  }
`;

export default function Home() {
  const [filter, setFilter] = useState("online");
  const { loading, error, data } = useQuery(GET_EVENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredEvents = data.events.filter((event: Event) =>
    filter === "online" ? event.isVirtual : !event.isVirtual
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <Header />

      <section className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">Latest Events</h2>
        <div className="flex mb-8">
          <button
            className={`px-4 py-2 rounded-full mr-2 ${filter === "online" ? "bg-green-200" : "bg-gray-200"
              }`}
            onClick={() => setFilter("online")}
          >
            Online
          </button>
          <button
            className={`px-4 py-2 rounded-full ${filter === "virtual" ? "bg-green-200" : "bg-gray-200"
              }`}
            onClick={() => setFilter("virtual")}
          >
            Virtual
          </button>
        </div>

        {filteredEvents.map((event: Event) => (
          <div
            key={event.id}
            className="border p-4 mb-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
              <p>{event.description}</p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              {/* <p className="text-right">Organizer: {event.organizer.name}</p> */}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}