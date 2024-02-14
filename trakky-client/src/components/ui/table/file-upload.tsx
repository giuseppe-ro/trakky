import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FileUploadButtonProps {
  onUpload: (file: File, signal?: AbortSignal | undefined) => Promise<void>;
  text: string;
  className?: string;
  disabled?: boolean;
}

export function FileUploadItem({
  onUpload,
  text,
  className,
  disabled,
}: FileUploadButtonProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
      hiddenFileInput.current.value = '';
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];

      onUpload(fileUploaded).then(() => {});
    }
  };

  return (
    <>
      <Button
        disabled={disabled}
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
  disabled: false,
};
