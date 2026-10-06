export const typeDefs = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
    }
    
    type Product {
        id: ID!
        name: String!
        description: String!
        price: Float!
        material: String!
        gemstone: String
        weight: Float
        size: String
        inStock: Boolean!
        quantity: Int!
        owner: User!
    }
    
    type AuthPayload {
        token: String!
        user: User!
    }
    
    type Query {
        users: [User!]!
        me: User
        products: [Product!]!
        product(id: ID!): Product
    }
    
    type Mutation {
        register(name: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createProduct(
            name: String!
            description: String!
            price: Float!
            material: String!
            gemstone: String
            weight: Float
            size: String
            quantity: Int!
        ): Product!
        deleteProduct(id: ID!): Boolean!
    }
`;
