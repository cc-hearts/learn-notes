import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
const BookType = new GraphQLObjectType({
    name: "BookType",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        generate: { type: GraphQLString },
    }),
});
const rootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                // 上面的args 就是第二个参数
                console.log(parent, args);
            },
        },
    },
});
export default new GraphQLSchema({
    query: rootQuery,
});
