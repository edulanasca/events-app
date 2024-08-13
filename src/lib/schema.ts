import { Context } from "eventsapp/types/graphql";
import { createSchema } from "graphql-yoga";
import { PrismaClient, Event, Attendee, Allowlist, Category } from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = `
type Query {
    me: User
    event(id: Int!): Event
    events: [Event]
    attendees(eventId: Int!): [Attendee]
    allowlist(eventId: Int!): [Allowlist]
    categories: [Category]
}

type Mutation {
    createEvent(title: String!, description: String, date: String, location: String, isVirtual: Boolean!): Event
    editEvent(id: Int!, title: String, description: String, date: String, location: String, isVirtual: Boolean): Event
    deleteEvent(id: Int!): Event
    createAttendee(eventId: Int!, userId: String!): Attendee
    editAttendee(id: Int!, userId: String, eventId: Int): Attendee
    deleteAttendee(id: Int!): Attendee
    createAllowlistEntry(eventId: Int!, userId: String!): Allowlist
    editAllowlistEntry(id: Int!, approved: Boolean): Allowlist
    deleteAllowlistEntry(id: Int!): Allowlist
    createCategory(name: String!): Category
    editCategory(id: Int!, name: String!): Category
    deleteCategory(id: Int!): Category
    addCategoryToEvent(eventId: Int!, categoryId: Int!): Event
    approveUserFromAllowlist(eventId: Int!, userId: String!): Allowlist
}

type Event {
    id: Int!
    title: String!
    description: String
    date: String
    location: String
    isVirtual: Boolean
    organizer: User!
    attendees: [Attendee]
    allowlist: [Allowlist]
    categories: [Category]
}

type User {
    id: String!
    name: String
    email: String!
    organizedEvents: [Event]
    attendedEvents: [Attendee]
    allowlistEntries: [Allowlist]
}

type Attendee {
    id: Int!
    user: User!
    event: Event!
}

type Allowlist {
    id: Int!
    user: User!
    event: Event!
    approved: Boolean!
}

type Category {
    id: Int!
    name: String!
    events: [Event]
}
`;

const resolvers = {
    Query: {
        me: async (_: unknown, __: unknown, context: Context) => {
            return context.user;
        },
        event: async (_: unknown, { id }: { id: number }) => {
            return await prisma.event.findUnique({
                where: { id },
                include: { organizer: true, attendees: true, allowlist: true, categories: true }
            });
        },
        events: async () => {
            return await prisma.event.findMany({
                include: { organizer: true, attendees: true, allowlist: true, categories: true }
            });
        },
        attendees: async (_: unknown, { eventId }: { eventId: number }) => {
            return await prisma.attendee.findMany({
                where: { eventId },
                include: { user: true, event: true }
            });
        },
        allowlist: async (_: unknown, { eventId }: { eventId: number }) => {
            return await prisma.allowlist.findMany({
                where: { eventId },
                include: { user: true, event: true }
            });
        },
        categories: async () => {
            return await prisma.category.findMany();
        }
    },
    Mutation: {
        createEvent: async (_: unknown, args: Event, context: Context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return await prisma.event.create({
                data: {
                    ...args,
                    organizerId: context.user.id,
                }
            });
        },
        editEvent: async (_: unknown, { id, ...args }: { id: number, [key: string]: unknown }) => {
            return await prisma.event.update({
                where: { id },
                data: args
            });
        },
        deleteEvent: async (_: unknown, { id }: { id: number }) => {
            return await prisma.event.delete({
                where: { id }
            });
        },
        createAttendee: async (_: unknown, args: Attendee) => {
            return await prisma.attendee.create({
                data: args
            });
        },
        editAttendee: async (_: unknown, { id, ...args }: { id: number, [key: string]: unknown }) => {
            return await prisma.attendee.update({
                where: { id },
                data: args
            });
        },
        deleteAttendee: async (_: unknown, { id }: { id: number }) => {
            return await prisma.attendee.delete({
                where: { id }
            });
        },
        createAllowlistEntry: async (_: unknown, args: Allowlist) => {
            return await prisma.allowlist.create({
                data: args
            });
        },
        editAllowlistEntry: async (_: unknown, { id, ...args }: { id: number, [key: string]: unknown }) => {
            return await prisma.allowlist.update({
                where: { id },
                data: args
            });
        },
        deleteAllowlistEntry: async (_: unknown, { id }: { id: number }) => {
            return await prisma.allowlist.delete({
                where: { id }
            });
        },
        createCategory: async (_: unknown, args: Category) => {
            return await prisma.category.create({
                data: args
            });
        },
        editCategory: async (_: unknown, { id, ...args }: { id: number, [key: string]: unknown }) => {
            return await prisma.category.update({
                where: { id },
                data: args
            });
        },
        deleteCategory: async (_: unknown, { id }: { id: number }) => {
            return await prisma.category.delete({
                where: { id }
            });
        },
        addCategoryToEvent: async (_: unknown, { eventId, categoryId }: { eventId: number, categoryId: number }) => {
            return await prisma.event.update({
                where: { id: eventId },
                data: {
                    categories: {
                        connect: { id: categoryId }
                    }
                }
            });
        },
        approveUserFromAllowlist: async (_: unknown, { eventId, userId }: { eventId: number, userId: string }) => {
            return await prisma.allowlist.updateMany({
                where: { eventId, userId },
                data: { approved: true }
            });
        }
    }
};

const schema = createSchema<Context>({
    typeDefs,
    resolvers
});

export default schema;