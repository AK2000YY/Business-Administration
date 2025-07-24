import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import type { DeviceType } from '@/types/device_type'
import { Button } from './ui/button'

const FormDeviceAdd = ({types, handleAdd} : {
  types: DeviceType[],
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void
}) => {


  return (
    <DialogContent>
      <form onSubmit={handleAdd}>
        <DialogHeader>
          <DialogTitle>إضافة جهاز جديد</DialogTitle>
          <DialogDescription>إملأ الحقول المطلوبة لإضافة جهاز جديد</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex gap-x-2">
            <Label htmlFor="serial" className="w-30">الرقم التسلسلي</Label>
            <Input id="serial" name="serial" placeholder="ادخل رقم الجهاز التسلسلي" />
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="device_name" className="w-30">اسم الجهاز</Label>
            <Input id="device_name" name="device_name" placeholder="ادخل اسم الجهاز" />
          </div>
          <div className="flex gap-x-2">
            <Label className="max-w-30">النوع</Label>
            <Select name="device_type_id">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الأنواع</SelectLabel>
                  {types.map(ele => 
                    <SelectItem key={ele.id} value={ele.id}>{ele.type}</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Label htmlFor="owning_entity" className="w-30">الجهة المالكة</Label>
            <Input id="owning_entity" name="owning_entity" placeholder="ادخل الجهة المالكة" />
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
  )
}

export default FormDeviceAdd