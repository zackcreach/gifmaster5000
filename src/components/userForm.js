import { useState } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { useMutation, useApolloClient } from "@apollo/client";
import { getErrorMessage } from "../../utils/form";
import { Button, Box, Form, FormField, TextInput, Text } from "grommet";

export default function UserForm() {
  const router = useRouter();
  const client = useApolloClient();

  const [signIn] = useMutation(SignInMutation);
  const [signUp] = useMutation(SignUpMutation);

  const isSignInRoute = router.pathname === "/signin";
  const isSignUpRoute = router.pathname === "/signup";

  const defaultValue = {
    email: null,
    password: null,
  };

  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState({ message: null });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await client.resetStore();

      const variables = {
        email: event.value.email,
        password: event.value.password,
      };

      let data = null;
      if (isSignInRoute) {
        data = await signIn({ variables });
      } else if (isSignUpRoute) {
        data = await signUp({ variables });
      }

      await router.push("/");
    } catch (error) {
      console.log({ error });
      setError({ message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  }

  function handleChange(nextValue) {
    setValue(nextValue);
  }

  return (
    <Box pad={{ vertical: "large" }} width="medium">
      <Form value={value} onSubmit={handleSubmit} onChange={handleChange}>
        <FormField name="email" htmlFor="email-input-id" label="Email">
          <TextInput
            name="email"
            type="email"
            autoComplete="email"
            htmlFor="email-input-id"
            required
          />
        </FormField>
        <FormField name="password" htmlFor="password-input-id" label="Password">
          <TextInput
            name="password"
            type="password"
            autoComplete="password"
            htmlFor="password-input-id"
            required
          />
        </FormField>

        {isSubmitted && error.message && (
          <Box pad={{ bottom: "medium" }}>
            <Text color="status-error">{error.message}</Text>
          </Box>
        )}

        <Box direction="row" pad="small" align="center">
          <Button
            type="submit"
            label={isSignUpRoute ? "Sign up" : "Sign in"}
            disabled={isLoading}
            primary
          />
        </Box>
      </Form>
    </Box>
  );
}

const SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      user {
        user_id
        email
      }
    }
  }
`;

const SignInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        user_id
        email
      }
    }
  }
`;
