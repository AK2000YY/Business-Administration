import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import type { Service } from '@/types/service'


const FormServiceEdit = ({arrivalOpen, setArrivalOpen, arrivalDate, setArrivalDate, delieveryOpen, setDelieveryOpen, delieveryDate, setDelieveryDate, service, onUpdate}: {
    arrivalOpen: boolean,
    arrivalDate: Date | undefined,
    delieveryOpen: boolean,
    delieveryDate: Date | undefined,
    setArrivalOpen: any,
    setArrivalDate: any,
    setDelieveryOpen: any,
    setDelieveryDate: any,
    service: Service,
    onUpdate: (e: React.FormEvent<HTMLFormElement>) => void
}) => {
  const services: string[] = ["تبديل قطعة", "تنزيل نظام", "تنزيل برامج", "صيانة"]

  return (
     <DialogContent className="min-w-fit">
           <form onSubmit={onUpdate}>
            <DialogHeader>
                <DialogTitle>تعديل البيانات</DialogTitle>
                <DialogDescription>عدل الحقول التالية واحفظ التعديل</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
                <input name="id" defaultValue={service.id} hidden/>
                <input name="job_id" defaultValue={service.job_id} hidden/>
                <div className="flex gap-x-2">
                    <Label>الحالة</Label>
                    <Select name="service" defaultValue={service.service}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>الحالات</SelectLabel>
                        {services.map(ele => 
                            <SelectItem key={ele} value={ele}>{ele}</SelectItem>
                        )}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-x-2">
                    <Label htmlFor="attachments">المرفقات</Label>
                    <Input id="attachments" name="attachments" placeholder="ادخل المرفقات" defaultValue={service.attachments}/>
                </div>
                <div className="flex gap-x-2">
                    <Label htmlFor="executing_entity">الجهة المنفذة</Label>
                    <Input id="executing_entity" name="executing_entity" placeholder="ادخل الجهة المنفذة" defaultValue={service.executing_entity}/>
                </div>
                <div className="flex gap-x-2">
                    <Label htmlFor="notes">الملاحظات</Label>
                    <Input id="notes" name="notes" placeholder="ادخل ملاحظاتك" defaultValue={service.notes} />
                </div>
                <div className="flex gap-x-2">
                <div className="flex gap-x-2">
                    <div className="flex gap-x-2">
                        <Label className="px-1">
                            تاريخ الوصول
                        </Label>
                        <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            id="date"
                            className="w-48 justify-between font-normal"
                            >
                            {arrivalDate ? arrivalDate.toLocaleDateString() : "اختر التاريخ"}
                            <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={arrivalDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setArrivalDate(date)
                                setArrivalOpen(false)
                            }}
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex gap-x-2">
                        <Label className="px-1">
                        تاريخ التسليم
                        </Label>
                        <Popover open={delieveryOpen} onOpenChange={setDelieveryOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            id="date"
                            className="w-48 justify-between font-normal"
                            >
                            {delieveryDate ? delieveryDate.toLocaleDateString() : "اختر التاريخ"}
                            <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={arrivalDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setDelieveryDate(date)
                                setDelieveryOpen(false)
                            }}
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                </div>
                </div>
                <div className="flex gap-x-2">
                <div className="flex gap-x-2">
                    <Label htmlFor="cost">التكلفة</Label>
                    <Input id="cost" type="number" name="cost" placeholder="ادخل التكلفة" defaultValue={service.cost}/>
                </div>
                <div className="flex gap-x-2">
                    <Label htmlFor="phone_number">رقم الهاتف</Label>
                    <Input id="phone_number" name="phone_number" placeholder="ادخل رقم الهاتف" defaultValue={service.phone_number}/>
                </div>
                </div>
                <div className="flex gap-x-2">
                <div className="flex gap-x-2">
                    <Label htmlFor="system_version">نظام التشغيل</Label>
                    <Input id="system_version" name="system_version" placeholder="ادخل اسم النظام" defaultValue={service.system_version}/>
                </div>
                <div className="flex gap-x-2">
                    <Label htmlFor="device_password">كلمة السر</Label>
                    <Input id="device_password" name="device_password" placeholder="ادخل كلمة السر" defaultValue={service.device_password}/>
                </div>
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

export default FormServiceEdit