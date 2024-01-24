import { useRef } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export interface FileUploadButtonProps {
  onUpload: (file: File) => Promise<void>;
  text: string;
  className?: string;
}

export function FileUploadItem(props: FileUploadButtonProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
      hiddenFileInput.current.value = "";
    }
  };

  const handleChange = (event: any) => {
    if (event.target.files) {

      const fileUploaded = event.target.files[0];

      console.log("handle change")
      props.onUpload(fileUploaded).then(() => {
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`w-full ${props.className}`}
        onClick={handleClick}
      >
        {props.text}
      </Button>
      <Input
        accept="application/JSON"
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
