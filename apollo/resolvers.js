import { AuthenticationError, UserInputError } from "apollo-server-micro";
import { GraphQLUpload } from "graphql-upload";
import GraphQLJSON from "graphql-type-json";
import { createUser, findUser, validatePassword } from "../lib/user";
import { getGifList, getGif, createGif, editGif, deleteGif } from "../lib/gifs";
import { getTagList, getTag, createTag, editTag, deleteTag } from "../lib/tags";
import { setLoginSession, getLoginSession } from "../lib/auth";
import { uploadImage } from "../lib/file";
import { removeTokenCookie } from "../lib/auth-cookies.js";
import db from "../lib/database";

export const resolvers = {
  FileUpload: GraphQLUpload,
  JSON: GraphQLJSON,
  Query: {
    async viewer(_parent, _args, context, _info) {
      try {
        const session = await getLoginSession(context.req);

        if (session) {
          return findUser({ email: session.email }, db);
        }
      } catch (error) {
        throw new AuthenticationError(
          "Authentication token is invalid, please log in"
        );
      }
    },
    async gifs(_parent, _args, _context, _info) {
      try {
        const result = await getGifList(db);

        return result;
      } catch (error) {
        throw new Error(
          `Error: gifs could not be retrieved. Details: ${error}`
        );
      }
    },
    async gif(_parent, args, _context, _info) {
      try {
        const result = await getGif(args.gif_id, db);

        return { result };
      } catch (error) {
        throw new Error(`Error: gif could not be retrieved. Details: ${error}`);
      }
    },
    async tags(_parent, _args, _context, _info) {
      try {
        const result = await getTagList(db);

        return result;
      } catch (error) {
        throw new Error(
          `Error: tags could not be retrieved. Details: ${error}`
        );
      }
    },
    async tag(_parent, args, _context, _info) {
      try {
        const result = await getTag(args.tag_id, db);

        return { result };
      } catch (error) {
        throw new Error(`Error: tag could not be retrieved. Details: ${error}`);
      }
    },
  },
  Mutation: {
    async signUp(_parent, args, _context, _info) {
      const user = await createUser(args.input, db);
      return { user };
    },
    async signIn(_parent, args, context, _info) {
      const user = await findUser({ email: args.input.email }, db);

      if (user && (await validatePassword(user, args.input.password))) {
        const session = {
          user_id: user.user_id,
          email: user.email,
        };

        await setLoginSession(context.res, session);

        return { user };
      }

      throw new UserInputError("Invalid email and password combination");
    },
    async signOut(_parent, _args, context, _info) {
      removeTokenCookie(context.res);
      return true;
    },
    async uploadFile(_parent, args, _context, _info) {
      const file = await uploadImage(args.file);
      return { file };
    },
    async addGif(_parent, args, _context, _info) {
      const gif = await createGif(args.input, db);
      return { gif };
    },
    async editGif(_parent, args, _context, _info) {
      const gif = await editGif(args.input, db);
      return { gif };
    },
    async removeGif(_parent, args, _context, _info) {
      const response = await deleteGif(args.input, db);
      return response;
    },
    async addTag(_parent, args, _context, _info) {
      const tag = await createTag(args.input, db);
      return { tag };
    },
    async editTag(_parent, args, _context, _info) {
      const tag = await editTag(args.input, db);
      return { tag };
    },
    async removeTag(_parent, args, _context, _info) {
      const response = await deleteTag(args.input, db);
      return response;
    },
  },
};
