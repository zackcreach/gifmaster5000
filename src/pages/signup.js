import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { getErrorMessage } from "../../lib/form";
import Field from "../components/field";

function SignUp() {
  const [signUp] = useMutation(SignUpMutation);
  const [error, setError] = useState();
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    const emailElement = event.currentTarget.elements.email;
    const passwordElement = event.currentTarget.elements.password;

    try {
      await signUp({
        variables: {
          email: emailElement.value,
          password: passwordElement.value,
        },
      });

      router.push("/signin");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <Field
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email"
        />
        <Field
          name="password"
          type="password"
          autoComplete="password"
          required
          label="Password"
        />
        <button type="submit">Sign up</button> or{" "}
        <Link href="signin">
          <a>Sign in</a>
        </Link>
      </form>
    </>
  );
}

const SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`;

export default SignUp;
