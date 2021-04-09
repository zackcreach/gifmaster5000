import { gql } from "@apollo/client";

export const typeDefs = gql`
  scalar FileUpload
  scalar JSON

  type User {
    id: ID!
    email: String!
    created_ts: String!
    hash: String!
    salt: String!
  }
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Gif {
    id: ID!
    file: JSON!
    name: String!
    tags: [String]
    created_ts: String!
    updated_ts: String!
  }
  type Tag {
    id: ID!
    name: String!
    created_ts: String!
  }

  input SignUpInput {
    email: String!
    password: String!
  }
  input SignInInput {
    email: String!
    password: String!
  }
  input AddGifInput {
    file: JSON!
    name: String!
    tags: [String]
  }
  input EditGifInput {
    id: ID!
    file: JSON!
    name: String!
    tags: [String]
  }
  input RemoveGifInput {
    id: String!
  }

  type SignUpPayload {
    user: User!
  }
  type SignInPayload {
    user: User!
  }
  type AddFilePayload {
    file: File!
  }
  type AddGifPayload {
    gif: Gif!
  }
  type EditGifPayload {
    gif: Gif!
  }
  type RemoveGifPayload {
    success: Boolean!
  }

  type Query {
    user(id: ID!): User!
    users: [User]!
    viewer: User
    gifs: [Gif]
    gif(id: ID!): Gif!
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
    uploadFile(file: FileUpload!): File!
    addGif(input: AddGifInput!): AddGifPayload!
    editGif(input: EditGifInput!): EditGifPayload!
    removeGif(input: RemoveGifInput!): RemoveGifPayload!
  }
`;
