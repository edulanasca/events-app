"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import Header from "eventsapp/components/Header";
import { useState } from "react";
import { GET_EVENT_ONLY } from "eventsapp/graphql/eventQueries";
import { UPDATE_EVENT } from "eventsapp/graphql/eventMutations";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  location: Yup.string(),
  isVirtual: Yup.boolean().default(false),
  requiresApproval: Yup.boolean().default(false),
  maxAttendees: Yup.number().required("Max attendees is required"),
});

export default function EditEvent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id.toString();
  const { data, loading, error, refetch } = useQuery(GET_EVENT_ONLY, { variables: { id: Number(id) } });
  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading event.</p>;
  const event = data.event;

  const formatDate = (date: Date) => {
    const pad = (num: number) => (num < 10 ? '0' : '') + num;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const initialValues: Partial<Omit<Event, "date"> & { date: string }> = {
    title: event.title,
    description: event.description,
    location: event.location,
    date: formatDate(new Date(Number(event.date))),
    isVirtual: event.isVirtual,
    requiresApproval: event.requiresApproval,
    maxAttendees: event.maxAttendees,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<typeof initialValues>) => {
    try {
      await updateEvent({ variables: { id: Number(id), ...values, date: values.date ? new Date(values.date).toISOString() : undefined } });
      await refetch();
      router.push(`/event/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorMessage("Failed to update event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1">
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="date" className="block mb-1">
                  Date
                </label>
                <Field
                  type="datetime-local"
                  id="date"
                  name="date"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="location" className="block mb-1">
                  Location
                </label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label htmlFor="isVirtual" className="mr-2">
                  Is Virtual
                </label>
                <Field
                  type="checkbox"
                  id="isVirtual"
                  name="isVirtual"
                  className="h-4 w-4 text-black"
                />
                <ErrorMessage
                  name="isVirtual"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label htmlFor="requiresApproval" className="mr-2">
                  Requires Approval
                </label>
                <Field
                  type="checkbox"
                  id="requiresApproval"
                  name="requiresApproval"
                  className="h-4 w-4 text-black"
                />
                <ErrorMessage
                  name="requiresApproval"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="maxAttendees" className="block mb-1">
                  Max Attendees
                </label>
                <Field
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage
                  name="maxAttendees"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}