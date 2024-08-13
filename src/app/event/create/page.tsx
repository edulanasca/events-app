"use client";

import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String
    $date: String
    $location: String
    $isVirtual: Boolean!
  ) {
    createEvent(
      title: $title
      description: $description
      date: $date
      location: $location
      isVirtual: $isVirtual
    ) {
      id
      title
      description
      date
      location
      isVirtual
      organizer {
        id
        name
      }
    }
  }
`;

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  date: Yup.date().default(new Date()),
  location: Yup.string(),
  isVirtual: Yup.string().required("Event type is required"),
  organizerId: Yup.string().required("Organizer ID is required"),
});

export default function CreateEvent() {
  const router = useRouter();
  const [createEvent] = useMutation(CREATE_EVENT);

  const initialValues: Partial<Event> = {
    title: "",
    description: "",
    location: "",
    date: new Date(),
    isVirtual: true,
    organizerId: "",
  };

  const handleSubmit = async (values: Partial<Event>, { setSubmitting }: FormikHelpers<Partial<Event>>) => {
    try {
      await createEvent({ variables: { ...values, isVirtual: values.isVirtual?.toString() === "online" } });
      router.push("/");
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
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
                type="date"
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
            <div>
              <label htmlFor="isVirtual" className="block mb-1">
                Event Type
              </label>
              <Field
                as="select"
                id="isVirtual"
                name="isVirtual"
                className="w-full px-3 py-2 border rounded text-black"
              >
                <option value={"online"}>Online</option>
                <option value={"in-person"}>In-Person</option>
              </Field>
              <ErrorMessage
                name="isVirtual"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
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
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}