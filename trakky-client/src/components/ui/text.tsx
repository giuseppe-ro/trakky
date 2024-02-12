import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";

export function Title({ title, ...props }: { title?: string }) {
  return (
    <div data-aos="fade-zoom-in" data-aos-easing="ease-in-out">
      <Card className="bg-transparent border-none" {...props}>
        <CardHeader className="bg-transparent">
          <CardTitle
            title={title}
            className="flex flex-col items-center w-full justify-center bg-transparent p-0 md:p-6"
          >
            <p className="m-6 text-2xl bg-transparent">{title}</p>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export function SubTitle({ title, ...props }: { title?: string }) {
  return (
    <div data-aos="fade-zoom-in" data-aos-easing="ease-in-out">
      <Card className="bg-transparent border-none" {...props}>
        <CardHeader className="bg-transparent">
          <CardTitle
            title={title}
            className="flex flex-col items-center w-full justify-center bg-transparent p-0 md:p-6"
          >
            <p className="w-full px-5 pt-0 text-sm bg-transparent text-slate-500">{title}</p>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

