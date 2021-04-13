import { gql } from "@apollo/client";

export const typeDefs = gql`
  scalar FileUpload
  scalar JSON

  type User {
    user_id: ID!
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
    gif_id: ID!
    gif_name: String!
    file: JSON!
    tags: [Tag]
    created_ts: String!
    updated_ts: String!
  }
  type Tag {
    tag_id: ID!
    tag_name: String!
    created_ts: String!
    updated_ts: String!
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
    gif_name: String!
    file: JSON!
    tags: [String]
  }
  input EditGifInput {
    gif_id: ID!
    gif_name: String!
    file: JSON!
    tags: [String]
  }
  input RemoveGifInput {
    gif_id: ID!
  }
  input AddTagInput {
    tag_name: String!
  }
  input EditTagInput {
    tag_id: ID!
    tag_name: String!
  }
  input RemoveTagInput {
    tag_id: ID!
  }

  type SignUpPayload {
    user: User
  }
  type SignInPayload {
    user: User
  }
  type AddFilePayload {
    file: File
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

  type Query {
    user(user_id: ID!): User!
    users: [User]!
    viewer: User
    gifs: [Gif]
    gif(gif_id: ID!): Gif!
    tags: [Tag]
    tag(tag_id: ID!): Tag!
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
    uploadFile(file: FileUpload!): File!
    addGif(input: AddGifInput!): AddGifPayload!
    editGif(input: EditGifInput!): EditGifPayload!
    removeGif(input: RemoveGifInput!): RemoveGifPayload!
    addTag(input: AddTagInput!): AddTagPayload!
    editTag(input: EditTagInput!): EditTagPayload!
    removeTag(input: RemoveTagInput!): RemoveTagPayload!
  }
`;
