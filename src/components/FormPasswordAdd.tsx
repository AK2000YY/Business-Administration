import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { passwordType, type PasswordType } from "@/types/password";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

const FormPasswordAdd = ({
  onAdd,
}: {
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [formSelector, setFormSelector] = useState<PasswordType | undefined>(
    undefined
  );

  const [initialPassword, setInitialPassword] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const getFirstUnsedPassword = async () => {
      const user = await supabase.auth.getUser();
      console.log(user);
      const { data, error } = await supabase.rpc("get_first_missing", {
        p_user: user.data.user!.id,
      });
      if (error) {
        toast.error("حدث خطأ ما!");
        return;
      }
      console.log("hi", data);
      setInitialPassword(data);
    };

    if (formSelector != undefined) getFirstUnsedPassword();
  }, [formSelector]);

  return (
    <DialogContent className="min-w-fit">
      <form onSubmit={onAdd}>
        <DialogHeader>
          <DialogTitle>إضافة كلمة مرور</DialogTitle>
          <DialogDescription>إملأ الحقول للإضافة</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex gap-x-2">
            <Label className="min-w-18">الحالة</Label>
            <Select
              name="type"
              onValueChange={(value: PasswordType) => setFormSelector(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الحالات</SelectLabel>
                  {passwordType.map((ele) => (
                    <SelectItem key={ele} value={ele}>
                      {ele}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {initialPassword != undefined && (
            <>
              <div className="flex gap-x-2">
                <Label htmlFor="number" className="min-w-18">
                  الرقم
                </Label>
                <Input
                  id="number"
                  name="number"
                  placeholder="ادخل رقم كلمة المرور"
                  value={initialPassword || ""}
                  onChange={(e) => setInitialPassword(+e.target.value)}
                />
              </div>
              {formSelector === "ويندوز" && (
                <>
                  <div className="flex gap-x-2">
                    <Label htmlFor="username" className="min-w-18">
                      كلمة المستخدم
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="ادخل كلمة مرور المستخدم"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="bios" className="min-w-18">
                      كلمة البيوس
                    </Label>
                    <Input
                      id="bios"
                      name="bios"
                      placeholder="ادخل كلمة مرور قفل البيوس"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="ice" className="min-w-18">
                      كلمة التجميد
                    </Label>
                    <Input
                      id="ice"
                      name="ice"
                      placeholder="ادخل كلمة مرور فك التجميد"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="file" className="min-w-18">
                      تشفير أنكليزي
                    </Label>
                    <Input
                      id="file"
                      name="file"
                      placeholder="ادخل كلمة مرور التشفير"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="file_arabic" className="min-w-18">
                      تشفير عربي
                    </Label>
                    <Input
                      id="file_arabic"
                      name="file_arabic"
                      placeholder="ادخل كلمة مرور التشفير"
                    />
                  </div>
                </>
              )}
              {formSelector === "لينيكس" && (
                <>
                  <div className="flex gap-x-2">
                    <Label htmlFor="username" className="min-w-18">
                      كلمة المستخدم
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="ادخل كلمة مرور المستخدم"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="bios" className="min-w-18">
                      كلمة البيوس
                    </Label>
                    <Input
                      id="bios"
                      name="bios"
                      placeholder="ادخل كلمة مرور قفل البيوس"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="system" className="min-w-18">
                      كلمة النظام
                    </Label>
                    <Input
                      id="system"
                      name="system"
                      placeholder="ادخل كلمة مرور قفل النظام"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="file" className="min-w-18">
                      تشفير أنكليزي
                    </Label>
                    <Input
                      id="file"
                      name="file"
                      placeholder="ادخل كلمة مرور التشفير"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="file_arabic" className="min-w-18">
                      تشفير عربي
                    </Label>
                    <Input
                      id="file_arabic"
                      name="file_arabic"
                      placeholder="ادخل كلمة مرور التشفير"
                    />
                  </div>
                </>
              )}
              {formSelector === "وحدة تخزين" && (
                <>
                  <div className="flex gap-x-2">
                    <Label htmlFor="lock" className="min-w-18">
                      قفل
                    </Label>
                    <Input
                      id="lock"
                      name="lock"
                      placeholder="ادخل كلمة مرور القفل"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="file" className="min-w-18">
                      تشفير أنكليزي
                    </Label>
                    <Input
                      id="file"
                      name="file"
                      placeholder="ادخل كلمة مرور التشفير"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Label htmlFor="file_arabic" className="min-w-18">
                      تشفير عربي
                    </Label>
                    <Input
                      id="file_arabic"
                      name="file_arabic"
                      placeholder="ادخل كلمة مرور التشفير"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button type="submit">حفظ</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default FormPasswordAdd;
