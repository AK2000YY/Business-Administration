import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import type { DeviceType } from '@/types/device_type'
import { Button } from './ui/button'
import type { Work } from '@/types/work'


const FormDeviceUpdate = ({types, device, onUpdate}: {
    types: DeviceType[],
    device: Work,
    onUpdate: (e: React.FormEvent<HTMLFormElement>) => void
}) => {

  return (
    <DialogContent className="min-w-fit">
        <form onSubmit={onUpdate}>
            <DialogHeader>
                <DialogTitle>تعديل البيانات</DialogTitle>
                <DialogDescription>عدل الحقول التالية واحفظ التعديل</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
                <input name='id' defaultValue={device.id} hidden/>
                <div className="flex gap-x-2">
                    <Label htmlFor="serial" className="w-30">الرقم التسلسلي</Label>
                    <Input id="serial" name="serial" placeholder="ادخل رقم الجهاز التسلسلي" defaultValue={device.serial} />
                </div>
                <div className="flex gap-x-2">
                    <Label htmlFor="device_name" className="w-30">اسم الجهاز</Label>
                    <Input id="device_name" name="device_name" placeholder="ادخل اسم الجهاز" defaultValue={device.device_name}/>
                </div>
                <div className="flex gap-x-2">
                    <Label className="max-w-30">النوع</Label>
                    <Select name="device_type_id" defaultValue={device.device_types.id}>
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
                    <Input id="owning_entity" name="owning_entity" placeholder="ادخل الجهة المالكة" defaultValue={device.owning_entity} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
                </DialogClose>
                <Button type="submit">تعديل</Button>
            </DialogFooter>
        </form>
    </DialogContent>
  )
}

export default FormDeviceUpdate