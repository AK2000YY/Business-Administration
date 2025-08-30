import { useEffect, useState, type FC, type InputHTMLAttributes } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { FolderUp } from "lucide-react";

interface FileComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  fileName?: string[];
}

const FileComponent: FC<FileComponentProps> = ({
  fileName,
  className,
  ...props
}) => {
  const [fileUpload, setFileUpload] = useState<string[]>([]);

  useEffect(() => {
    if (fileName && fileName.length > 0) setFileUpload(fileName);
  }, []);

  const handleUploade = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((file) => file.name);
      setFileUpload(names);
    } else setFileUpload([]);
  };

  return (
    <div className="w-fit flex items-center h-fit relative">
      <input
        className={cn("w-22 h-10 display absolute opacity-0", className)}
        type="file"
        name="attach"
        onChange={handleUploade}
        multiple
        {...props}
      />
      <Button type="button" className="w-22 h-10">
        {fileName ? "غير الملف" : "اختر ملفا"}
        <FolderUp />
      </Button>
      <div className="flex">
        {fileUpload.map((ele) => (
          <p
            key={ele}
            className="w-20 truncate overflow-hidden whitespace-nowrap pr-4"
          >
            {ele}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FileComponent;
