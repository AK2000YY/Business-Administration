import { useEffect, useState, type FC, type InputHTMLAttributes } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { FolderUp } from "lucide-react";

interface FileComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  fileName?: string;
}

const FileComponent: FC<FileComponentProps> = ({
  fileName,
  className,
  ...props
}) => {
  const [fileUpload, setFileUpload] = useState<string>("");

  useEffect(() => {
    if (fileName && fileName != "") setFileUpload(fileName);
  }, []);

  const handleUploade = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileUpload(files[0].name);
    } else {
      setFileUpload(""); // إعادة التعيين عند الضغط على Cancel
    }
  };

  return (
    <div className="w-fit flex items-center h-fit relative">
      <input
        className={cn("w-22 h-10 display absolute opacity-0", className)}
        type="file"
        name="attach"
        onChange={handleUploade}
        {...props}
      />
      <Button type="button" className="w-22 h-10">
        {fileName ? "غير الملف" : "اختر ملفا"}
        <FolderUp />
      </Button>
      <p className="w-40 truncate overflow-hidden whitespace-nowrap pr-4">
        {fileUpload}
      </p>
    </div>
  );
};

export default FileComponent;
