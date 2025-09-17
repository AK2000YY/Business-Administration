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
import type { DeviceType } from "@/types/device_type";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useEffect, useState } from "react";
import type { Cpu } from "@/types/cpu";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { ramType } from "@/types/ram_type";
import { deviceStatus } from "@/types/device_status";
import { wifiCardStatus } from "@/types/wifi_card_status";
import FileComponent from "./FileComponent";
import { passwordType, type PasswordType } from "@/types/password";

const FormDeviceAdd = ({
  types,
  arrivalOpen,
  setArrivalOpen,
  arrivalDate,
  setArrivalDate,
  handleAdd,
}: {
  types: DeviceType[];
  arrivalOpen: boolean;
  arrivalDate: Date | undefined;
  setArrivalOpen: any;
  setArrivalDate: any;
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [cpus, setCpus] = useState<Cpu[]>([]);
  const [formSelector, setFomrSelector] = useState<PasswordType | undefined>(
    undefined
  );
  const [initailPassword, setInitialPassword] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const getCpus = async () => {
      const { data, error } = await supabase.from("cpus").select("*");
      console.log(data);
      if (error) toast.error("حدث خطأ ما!");
      else setCpus(data ?? []);
    };
    const getFirstUnsedPassword = async () => {
      const { data, error } = await supabase
        .from("passwords")
        .select("number,jobs ( id )")
        .is("jobs", null)
        .eq("type", formSelector)
        .order("number", { ascending: true })
        .limit(1);

      console.log(data);
      if (error) {
        toast.error("شيء ما خاطئ");
        console.log(error);
      } else if (data.length > 0) {
        setInitialPassword(data[0].number);
      } else {
        toast.error("لا يوجد كلمات مرور");
      }
    };
    if (!formSelector) getCpus();
    if (formSelector) getFirstUnsedPassword();
  }, [formSelector]);

  return (
    <DialogContent className="min-w-fit h-[98vh] overflow-y-auto">
      <form onSubmit={handleAdd}>
        <DialogHeader>
          <DialogTitle>إضافة جهاز جديد</DialogTitle>
          <DialogDescription>
            إملأ الحقول المطلوبة لإضافة جهاز جديد
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex gap-x-2">
            <Label htmlFor="serial" className="min-w-22">
              الرقم التسلسلي
            </Label>
            <Input
              id="serial"
              name="serial"
              placeholder="ادخل رقم الجهاز التسلسلي"
            />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="company" className="min-w-22">
              الشركة المصنعة
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="ادخل اسم الشركة المصنعة"
            />
          </div>
          <div className="flex gap-x-2">
            <Label className="min-w-22">النوع</Label>
            <Select name="device_type_id">
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الأنواع</SelectLabel>
                  {types.map((ele) => (
                    <SelectItem key={ele.id} value={ele.id}>
                      {ele.type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="model" className="min-w-22">
              الموديل
            </Label>
            <Input id="model" name="model" placeholder="الموديل" />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="cpu_factory" className="min-w-22">
              الشركة المصنعة للمعالج
            </Label>
            <Input
              id="cpu_factory"
              name="cpu_factory"
              placeholder="ادخل اسم شركة المعالج"
            />
          </div>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2">
              <Label htmlFor="cpu" className="text-nowrap min-w-22">
                فئة المعالج
              </Label>
              <Select name="cpu_id">
                <SelectTrigger className="w-[180px] ">
                  <SelectValue placeholder="اختر المعالج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>المعالجات</SelectLabel>
                    {cpus.map((ele) => (
                      <SelectItem key={ele.id} value={ele.id}>
                        {ele.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-x-2">
              <Label htmlFor="cpu_name" className="text-nowrap  min-w-22">
                جيل المعالج
              </Label>
              <Input
                id="cpu_name"
                name="cpu_name"
                placeholder="ادخل اسم المعالج"
              />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2">
              <Label className="text-nowrap min-w-22">نوع الرام</Label>
              <Select name="ram_type">
                <SelectTrigger className="w-[180px] ">
                  <SelectValue placeholder="اختر نوع الرام" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>أنواع الرام</SelectLabel>
                    {ramType.map((ele) => (
                      <SelectItem key={ele} value={ele}>
                        {ele.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-x-2 items-center">
              <Label htmlFor="ram" className="text-nowrap min-w-22">
                حجم الرام
              </Label>
              <div className="relative w-full max-w-xs">
                <Input
                  id="ram"
                  name="ram"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="ادخل حجم الرام"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  GB
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-x-2">
            <Label className="min-w-22">تاريخ الوصول</Label>
            <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {arrivalDate
                    ? arrivalDate.toLocaleDateString()
                    : "اختر التاريخ"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={arrivalDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setArrivalDate(date);
                    setArrivalOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2">
              <Label className="min-w-22">الحالة</Label>
              <Select name="status">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الحالة</SelectLabel>
                    {deviceStatus.map((ele) => (
                      <SelectItem key={ele} value={ele}>
                        {ele}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-x-2">
              <Label htmlFor="note" className="text-nowrap  min-w-22">
                ملاحظة
              </Label>
              <Input id="note" name="note" placeholder="ادخل ملاحظتك" />
            </div>
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="brother_name" className="min-w-22">
              اسم الأخ
            </Label>
            <Input
              id="brother_name"
              name="brother_name"
              placeholder="ادخل اسم الأخ"
            />
          </div>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2">
              <Label htmlFor="entity" className="min-w-22">
                الجهة الرئيسية
              </Label>
              <Input
                id="entity"
                name="entity"
                placeholder="ادخل الجهة الرئيسية"
              />
            </div>
            <div className="flex gap-x-2">
              <Label htmlFor="sub_entity" className="min-w-22">
                الجهة الفرعية
              </Label>
              <Input
                id="sub_entity"
                name="sub_entity"
                placeholder="ادخل الجهة الفرعية"
              />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2">
              <Label htmlFor="contact_number" className="min-w-22">
                رقم التواصل
              </Label>
              <Input
                id="contact_number"
                name="contact_number"
                placeholder="ادخل رقم التواصل"
              />
            </div>
            <div className="flex gap-x-2">
              <Label htmlFor="username" className="min-w-22">
                معرف الأخ
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="ادخل معرف الأخ"
              />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2">
              <Label htmlFor="password_num" className="min-w-22">
                كلمة المرور
              </Label>
              <Input
                id="password_num"
                name="password_num"
                placeholder="ادخل رقم كلمة المرور"
                value={initailPassword || ""}
                onChange={(e) => setInitialPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-x-2">
              <Label className="w-22">نوع النظام للكلمة</Label>
              <Select
                name="password_type"
                onValueChange={(value: PasswordType) => setFomrSelector(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="نوع الخاص بالكلمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>النوع</SelectLabel>
                    {passwordType.map((ele) => (
                      <SelectItem key={ele} value={ele}>
                        {ele}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="attachment" className="min-w-22">
              المرفق
            </Label>
            <FileComponent id="attachment" name="attachment" />
          </div>
          <div className="flex gap-x-2">
            <Label className="w-22">كرت الشبكة</Label>
            <Select name="wifi_card">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر ان كان موجود ام لا" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>كرت الشبكة</SelectLabel>
                  {wifiCardStatus.map((ele) => (
                    <SelectItem key={ele} value={ele}>
                      {ele}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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

export default FormDeviceAdd;
