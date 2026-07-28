import { Suspense } from "react";
import Login from "./Login";
import LoginLoader from './LoginLoader';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoader />}>
      <Login />
    </Suspense>
  );
}
