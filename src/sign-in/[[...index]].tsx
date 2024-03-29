import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="flex justify-center items-center w-full h-screen">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;
