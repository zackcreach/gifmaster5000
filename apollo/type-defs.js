import { gql } from "@apollo/client";

export const typeDefs = gql`
  scalar JSON

  #
  # Types
  #
  type User {
    user_id: ID!
    email: String!
    created_ts: String!
    hash: String!
    salt: String!
  }
  type Gif {
    gif_id: ID!
    gif_name: String!
    file: JSON!
    tags: [Tag]
    created_ts: String
    created_by: String
    updated_ts: String
    updated_by: String
  }
  type Tag {
    tag_id: ID!
    tag_name: String!
    created_ts: String
    created_by: String
    updated_ts: String
    updated_by: String
  }

  #
  # Inputs
  #
  input GetUserInput {
    user_id: String!
  }
  input SignUpInput {
    email: String!
    password: String!
  }
  input SignInInput {
    email: String!
    password: String!
  }
  input GetGifsInput {
    search: String
    limit: Int
    offset: Int
  }
  input GetGifInput {
    gif_name: String!
    file: JSON!
    tags: [String]
  }
  input AddGifInput {
    gif_name: String!
    file: JSON!
    tags: [String]
    created_by: ID!
    updated_by: ID!
  }
  input EditGifInput {
    gif_id: ID!
    gif_name: String!
    file: JSON!
    tags: [String]
    updated_by: ID!
  }
  input RemoveGifInput {
    gif_id: ID!
  }
  input GetTagsInput {
    limit: Int
    offset: Int
  }
  input GetTagInput {
    tag_id: String!
  }
  input AddTagInput {
    tag_name: String!
    created_by: ID!
    updated_by: ID!
  }
  input EditTagInput {
    tag_id: ID!
    tag_name: String!
    updated_by: ID!
  }
  input RemoveTagInput {
    tag_id: ID!
  }

  #
  # Payloads
  #
  type SignUpPayload {
    user: User
  }
  type SignInPayload {
    user: User
  }
  type AddGifPayload {
    gif: Gif
  }
  type EditGifPayload {
    gif: Gif
  }
  type RemoveGifPayload {
    gif: Gif
  }
  type AddTagPayload {
    tag: Tag
  }
  type EditTagPayload {
    tag: Tag
  }
  type RemoveTagPayload {
    tag: Tag
  }

  #
  # Query
  #
  type Query {
    user(input: GetUserInput!): User!
    users: [User]!
    viewer: User
    gifs(input: GetGifsInput!): [Gif]
    gif(input: GetGifInput!): Gif!
    tags(input: GetTagsInput!): [Tag]
    tag(input: GetTagInput!): Tag!
  }

  #
  # Mutation
  #
  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
    addGif(input: AddGifInput!): AddGifPayload!
    editGif(input: EditGifInput!): EditGifPayload!
    removeGif(input: RemoveGifInput!): RemoveGifPayload!
    addTag(input: AddTagInput!): AddTagPayload!
    editTag(input: EditTagInput!): EditTagPayload!
    removeTag(input: RemoveTagInput!): RemoveTagPayload!
  }
`;
