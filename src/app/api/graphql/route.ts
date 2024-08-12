import { createYoga } from "graphql-yoga";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "eventsapp/lib/prisma";
import schema from "eventsapp/lib/schema";
import { Context } from "eventsapp/types/graphql";

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
    console.error('SECRET_KEY is not set in the environment variables');
    process.exit(1);
}

const context = async (): Promise<Context> => {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    let user: User | null = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as {mail: string};
            user = await prisma.user.findUnique({
                where: {
                    email: decoded.mail
                }
            });
        } catch (error) {
            console.error(error);
        }
    }


    return { user };
};

const yoga = createYoga({
    schema,
    graphiql: true,
    context
});

export const GET = (request: NextRequest) => {
    return yoga.handleRequest(request, {waitUntil: context});
};

export const POST = (request: NextRequest) => {
    return yoga.handleRequest(request, {waitUntil: context});
};
