import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UserAddForm = ({
  onAdd,
}: {
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <DialogContent className="min-w-fit">
      <form onSubmit={onAdd}>
        <DialogHeader>
          <DialogTitle>إضافة مستخدم</DialogTitle>
          <DialogDescription>إملأ الحقول للإضافة</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex gap-x-2">
            <Label htmlFor="email" className="min-w-18">
              اسم المستخدم
            </Label>
            <Input id="email" name="email" placeholder="ادخل ملاحظاتك" />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="password" className="min-w-18">
              كلمة المرور
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="ادخل كلمة المرور"
            />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="confirm-password" className="min-w-18">
              تأكيد كلمة المرور
            </Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              placeholder="اكد كلمة المرور"
            />
          </div>
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

export default UserAddForm;
