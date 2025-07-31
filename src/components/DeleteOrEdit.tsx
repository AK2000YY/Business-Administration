import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import type { Work } from "@/types/work";
import type { DeviceType } from "@/types/device_type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useEffect, useState, type ReactNode } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import type { Service } from "@/types/service";
import type { Cpu } from "@/types/cpu";

type ELemetType = {
  id: string;
  tableName: "jobs" | "device_types" | "services" | "cpus";
  elementName: string;
};

const DeleteOrEdit = ({
  children,
  ele,
}: {
  children?: ReactNode;
  ele: Work | DeviceType | Service | Cpu;
}) => {
  const [element, setElement] = useState<ELemetType>();

  useEffect(() => {
    if ("wifi_card" in ele)
      setElement({
        id: ele.id,
        tableName: "jobs",
        elementName: ele.model ?? "",
      });
    else if ("type" in ele)
      setElement({
        id: ele.id,
        tableName: "device_types",
        elementName: ele?.type,
      });
    else if ("service_type" in ele)
      setElement({
        id: ele.id,
        tableName: "services",
        elementName: ele.service_type,
      });
    else if ("name" in ele)
      setElement({
        id: ele.id,
        tableName: "cpus",
        elementName: ele.name,
      });
  }, []);

  const handleDelete = async () => {
    const { error } = await supabase
      .from(element!.tableName)
      .delete()
      .eq("id", element!.id);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تمت عملية الحذف بنجاح");
  };

  return (
    <div className="flex gap-x-1 justify-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="size-min bg-[#165D4E]">
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل انت تريد حذف {element?.elementName}؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>نعم</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {children}
    </div>
  );
};

export default DeleteOrEdit;
