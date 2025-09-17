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
import { serviceStatus, serviceType, type Service } from "@/types/service";
import FileComponent from "./FileComponent";

const FormServiceEdit = ({
  service,
  onUpdate,
}: {
  service: Service;
  onUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <DialogContent className="min-w-fit">
      <form onSubmit={onUpdate}>
        <DialogHeader>
          <DialogTitle>تعديل</DialogTitle>
          <DialogDescription>عدل الحقول التالية</DialogDescription>
        </DialogHeader>
        <input hidden name="id" defaultValue={service.id} />
        <div className="grid gap-4 py-2">
          <div className="flex gap-x-2">
            <Label className="min-w-18">الحالة</Label>
            <Select name="status" defaultValue={service.status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الحالات</SelectLabel>
                  {serviceStatus.map((ele) => (
                    <SelectItem key={ele} value={ele}>
                      {ele}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Label className="min-w-18">التخديم</Label>
            <Select name="service_type" defaultValue={service.service_type}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر التخديم" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الخدمات</SelectLabel>
                  {serviceType.map((ele) => (
                    <SelectItem key={ele} value={ele}>
                      {ele}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="worker" className="min-w-18">
              القائم بالعمل
            </Label>
            <Input id="worker" name="worker" placeholder="ادخل ملاحظاتك" />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="notes" className="min-w-18">
              المتطلبات
            </Label>
            <Input
              id="requirements"
              name="requirements"
              defaultValue={service.requirements}
              placeholder="ادخل ملاحظاتك"
            />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="notes" className="min-w-18">
              الملاحظات
            </Label>
            <Input
              id="notes"
              name="notes"
              defaultValue={service.notes}
              placeholder="ادخل ملاحظاتك"
            />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="attach" className="min-w-18">
              المرفق
            </Label>
            <FileComponent fileName={service.attach ?? []} multiple={false} />
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

export default FormServiceEdit;
