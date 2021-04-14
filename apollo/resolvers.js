import { AuthenticationError, UserInputError } from "apollo-server-micro";
import GraphQLJSON from "graphql-type-json";
import { createUser, findUser, validatePassword } from "../lib/user";
import { getGifList, getGif, createGif, editGif, deleteGif } from "../lib/gifs";
import { getTagList, getTag, createTag, editTag, deleteTag } from "../lib/tags";
import { setLoginSession, getLoginSession } from "../lib/auth";
import { removeTokenCookie } from "../lib/auth-cookies.js";

export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    async viewer(_parent, _args, context, _info) {
      try {
        const session = await getLoginSession(context.req);

        if (session) {
          return findUser({ email: session.email });
        }
      } catch (error) {
        throw new AuthenticationError(
          "Authentication token is invalid, please log in"
        );
      }
    },
    async gifs(_parent, args, _context, _info) {
      try {
        const result = await getGifList(args.input);

        return result;
      } catch (error) {
        throw new Error(
          `Error: gifs could not be retrieved. Details: ${error}`
        );
      }
    },
    async gif(_parent, args, _context, _info) {
      try {
        const result = await getGif(args.input);

        return { result };
      } catch (error) {
        throw new Error(`Error: gif could not be retrieved. Details: ${error}`);
      }
    },
    async tags(_parent, args, _context, _info) {
      try {
        const result = await getTagList(args.input);

        return result;
      } catch (error) {
        throw new Error(
          `Error: tags could not be retrieved. Details: ${error}`
        );
      }
    },
    async tag(_parent, args, _context, _info) {
      try {
        const result = await getTag(args.input);

        return { result };
      } catch (error) {
        throw new Error(`Error: tag could not be retrieved. Details: ${error}`);
      }
    },
  },
  Mutation: {
    async signUp(_parent, args, _context, _info) {
      const user = await createUser(args.input);
      return { user };
    },
    async signIn(_parent, args, context, _info) {
      const user = await findUser({ email: args.input.email });

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
    async addGif(_parent, args, _context, _info) {
      const gif = await createGif(args.input);
      return { gif };
    },
    async editGif(_parent, args, _context, _info) {
      const gif = await editGif(args.input);
      return { gif };
    },
    async removeGif(_parent, args, _context, _info) {
      const gif = await deleteGif(args.input);
      return { gif };
    },
    async addTag(_parent, args, _context, _info) {
      const tag = await createTag(args.input);
      return { tag };
    },
    async editTag(_parent, args, _context, _info) {
      const tag = await editTag(args.input);
      return { tag };
    },
    async removeTag(_parent, args, _context, _info) {
      const tag = await deleteTag(args.input);
      return { tag };
    },
  },
};
