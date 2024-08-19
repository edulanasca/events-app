"use client";

import { useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import Header from "eventsapp/components/Header";
import { useState } from "react";
import { CREATE_EVENT } from "eventsapp/graphql/eventQueries";
import { useTranslation } from "../../../i18n/client";



export default function CreateEvent({ params: { lng } } : { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'translation');
  const router = useRouter();
  const [createEvent] = useMutation(CREATE_EVENT);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('events.titleRequired')),
    description: Yup.string(),
    location: Yup.string(),
    isVirtual: Yup.boolean().default(false),
    requiresApproval: Yup.boolean().default(false),
    maxAttendees: Yup.number().required(t('events.maxAttendeesRequired')),
  });

  const initialValues: Partial<Event> = {
    title: "",
    description: "",
    location: "",
    date: new Date(),
    isVirtual: false,
    requiresApproval: false,
    maxAttendees: 10,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<typeof initialValues>) => {
    try {
      const event = await createEvent({ variables: {...values, date: values.date ? new Date(values.date).toISOString() : undefined} });
      router.push("/event/" + event.data?.createEvent?.id);
    } catch (error) {
      console.error("Error creating event:", error);
      setErrorMessage(t('errors.failedToCreateEvent'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">{t('events.createEvent')}</h1>
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
                  {t('events.title')}
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
                  {t('events.description')}
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
                  {t('events.date')}
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
                  {t('events.location')}
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
                  {t('events.isVirtual')}
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
                  {t('events.requiresApproval')}
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
                  {t('events.maxAttendees')}
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
                    {t('events.creating')}
                  </>
                ) : (
                  t('events.createEvent')
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}