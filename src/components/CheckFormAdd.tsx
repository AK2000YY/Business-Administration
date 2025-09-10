import { DialogTitle } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { CheckService } from "@/types/check_service";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

const CheckFormAdd = ({
  check,
  onAdd,
  onUpdate,
}: {
  check?: CheckService;
  onAdd?: (e: React.FormEvent<HTMLFormElement>) => void;
  onUpdate?: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const onDelete = async () => {
    const { error } = await supabase
      .from("check_service")
      .delete()
      .eq("id", check?.id);
    if (error) toast.error("حدث خطأ اثناء الحذف!");
    else toast.success("تمت عملية الحذف بنجاح");
  };
  return (
    <DialogContent>
      <form onSubmit={onAdd ? onAdd : onUpdate}>
        <DialogHeader>
          <DialogTitle>تدقيق</DialogTitle>
          <DialogDescription>املأ التدقيق</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-3">
            <Label htmlFor="checker">المدقق</Label>
            <Input
              id="checker"
              name="checker"
              placeholder="ادخل اسم المدقق"
              defaultValue={check?.checker ?? ""}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="worker">القائم بالعمل</Label>
            <Input
              id="worker"
              name="worker"
              placeholder="ادخل اسم القائم بالعمل"
              defaultValue={check?.worker ?? ""}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="desciption">الوصف</Label>
            <Input
              id="desciption"
              name="desciption"
              placeholder="ادخل وصف عن التخديم"
              defaultValue={check?.desciption ?? ""}
            />
          </div>
        </div>
        {onAdd && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit">حفظ</Button>
          </DialogFooter>
        )}
        {onUpdate && (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={onDelete}
              >
                حذف
              </Button>
            </DialogClose>
            <Button type="submit">تعديل</Button>
          </DialogFooter>
        )}
      </form>
    </DialogContent>
  );
};

export default CheckFormAdd;
