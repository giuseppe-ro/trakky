import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeLeft } from '@/components/ui/animations/fade';

export function Title({ title, ...props }: { title?: string }) {
  return (
    <FadeLeft className="hidden sm:block">
      <Card className="border-none" {...props}>
        <CardHeader className="">
          <CardTitle
            aria-label="Title"
            title={title}
            className="flex flex-col items-center w-full justify-center p-0 md:p-6"
          >
            <p className="m-6 text-2xl">{title}</p>
          </CardTitle>
        </CardHeader>
      </Card>
    </FadeLeft>
  );
}

Title.defaultProps = {
  title: null,
};

export function SubTitle({ title, ...props }: { title?: string }) {
  return (
    <Card className="bg-transparent border-none" {...props}>
      <CardHeader className="bg-transparent">
        <CardTitle
          title={title}
          className="flex flex-col items-center w-full justify-center bg-transparent p-0 md:p-6"
        >
          <p className="w-full px-5 pt-0 text-xl text-primary">{title}</p>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

SubTitle.defaultProps = {
  title: null,
};
