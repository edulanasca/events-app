import { Context } from "eventsapp/types/graphql";
import { createSchema } from "graphql-yoga";

const typeDefs = `
type Query {
    hello: String
}
`;

const resolvers = {
    Query: {
        hello: () => "world"
    },
    Mutation: {

    }
};

const schema = createSchema<Context>({
    typeDefs,
    resolvers
});

export default schema;