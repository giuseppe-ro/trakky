import React, { useContext } from "react";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";
import Spinner from "@/components/ui/spinner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { demoMode } from "@/constants.ts";


export function PageContainer({ children, className }: { children: React.ReactNode, className?: string }) {

  const { loginInProgress, token, login, } = useContext<IAuthContext>(AuthContext)

  return (
    <>
      <div className={`md:container px-0 pb-2 md:px-12 mx-auto w-full transition ${className}`}>
          {
            loginInProgress ? <Spinner className="flex justify-center align-middle my-12" /> :
            token || demoMode ? children
              : <Login login={login} />
          }
      </div>
    </>

  );
}

export function Login({ login }: { login: () => void }) {

  return (
    <>
      <Card className="flex flex-row justify-center">
        <CardContent className="m-4 px-12 lg:px-32 border rounded-2xl">
          <div className="flex flex-col text-center justify-center align-middle">
            <Text title={"Welcome to Trakky!"} />

            <p className="mb-4 text-lg lg:text-xl text-muted-foreground bg-transparent">
              Login to start tracking your expenses
            </p>
            <Button
              variant="outline"
              onClick={() => login()}
              className="border-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function Containers({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`px-2 md:px-0 ${className}`}>
      {children}
    </div>
  );
}
