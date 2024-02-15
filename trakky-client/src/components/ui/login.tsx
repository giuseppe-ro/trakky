import { Button } from './button';
import { Card, CardContent } from './card';
import { Title } from './text';

export function Login({ login }: { login: () => void }) {
  return (
    <Card className="flex flex-row justify-center">
      <CardContent className="m-4 px-12 pb-12 lg:px-16 lg:pb-16 border rounded-2xl">
        <div className="flex flex-col text-center justify-center align-middle">
          <Title title="Welcome to Trakky!" />
          <img
            src="/owl_login.png"
            alt="Trakky Logo"
            className="w-32 h-32 mx-auto mb-6"
          />
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
  );
}

export default Login;
