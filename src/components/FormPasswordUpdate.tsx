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
import {
  passwordType,
  type Password,
  type PasswordType,
} from "@/types/password";
import { useEffect, useState } from "react";

const FormPasswordUpdate = ({
  password,
  onUpdate,
}: {
  password: Password;
  onUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [formSelector, setFormSelector] = useState<PasswordType | undefined>(
    undefined
  );

  useEffect(() => {
    setFormSelector(password.type);
  }, []);

  return (
    <DialogContent className="min-w-fit">
      <form onSubmit={onUpdate}>
        <DialogHeader>
          <DialogTitle>تعديل كلمة مرور</DialogTitle>
          <DialogDescription>عدل الحقول للتعديل</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <input hidden defaultValue={password.id} name="id" />
          <div className="flex gap-x-2">
            <Label className="min-w-18">الحالة</Label>
            <Select
              name="type"
              onValueChange={(value: PasswordType) => setFormSelector(value)}
              defaultValue={password.type}
              disabled
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
          <div className="flex gap-x-2">
            <Label htmlFor="number" className="min-w-18">
              الرقم
            </Label>
            <Input
              id="number"
              name="number"
              placeholder="ادخل رقم كلمة المرور"
              defaultValue={password.number}
              disabled
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
                  defaultValue={password.username}
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
                  defaultValue={password.bios}
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
                  defaultValue={password.ice}
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
                  defaultValue={password.file}
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
                  defaultValue={password.file_arabic}
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
                  defaultValue={password.username}
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
                  defaultValue={password.bios}
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
                  defaultValue={password.system}
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
                  defaultValue={password.file}
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
                  defaultValue={password.file_arabic}
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
                  defaultValue={password.lock}
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
                  defaultValue={password.file}
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
                  defaultValue={password.file_arabic}
                />
              </div>
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

export default FormPasswordUpdate;
