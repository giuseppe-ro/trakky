import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FileUploadButtonProps {
  onUpload: (file: File, signal?: AbortSignal | undefined) => Promise<void>;
  text: string;
  className?: string;
}

export function FileUploadItem(props: FileUploadButtonProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
      hiddenFileInput.current.value = '';
    }
  };

  const { onUpload, className, text } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];

      onUpload(fileUploaded).then(() => {});
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`w-full ${className}`}
        onClick={handleClick}
      >
        {text}
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

FileUploadItem.defaultProps = {
  className: null,
};
