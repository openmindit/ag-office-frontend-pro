import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
     <PageMeta
          title="AG Office – Connexion"
          description="Connexion sécurisée à la plateforme AG Office."
        />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
