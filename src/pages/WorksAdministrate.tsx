import DeleteOrEdit from "@/components/DeleteOrEdit"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import supabase from "@/lib/supabase"
import { type DeviceType } from "@/types/device_type"
import type { Work } from "@/types/work"
import { ChevronDownIcon, Pencil, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const WorksAdministrate = () => {
  
  const status: string[] = ['انتظار', 'مكتمل', 'ملغى']
  const [works, setWorks] = useState<Work[]>([])
  const [types, setTypes] = useState<DeviceType[]>([])

  const [arrivalOpen, setArrivalOpen] = useState(false)
  const [arrivalDate, setArriavalDate] = useState<Date | undefined>(undefined)

  const [delieveryOpen, setDelieveryOpen] = useState(false)
  const [delieveryDate, setDelieveryDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const getTypes = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, device_types(*)')
      console.log(error)
      console.log(data)
      if(error)
        toast.error("حدث خطأ ما!")
      else
        setWorks(data ?? [])
    }

    const getDeviceTypes = async () => {
      const { data, error } = await supabase
        .from('device_types')
        .select('*')
      if(error)
        toast.error("حدث خطأ ما!")
      else
        setTypes(data ?? [])
    }

    const channel = supabase
        .channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'jobs' },
            async ({ eventType, old, new: newData }) => {
                console.log(eventType)
                switch (eventType) {
                    case "INSERT":
                    case "UPDATE": {
                      const { data } = await supabase
                        .from('jobs')
                        .select('*, device_types(type)')
                        .eq('id', newData.id)
                        .single()

                      if (data) {
                        setWorks(prev =>
                          prev.some(job => job.id === data.id)
                            ? prev.map(job => job.id === data.id ? data : job)
                            : [...prev, data]
                        )
                      }
                      break;
                    }

                    case "DELETE": {
                        const job: Work = old as Work
                        setWorks(prev => prev.filter(ele => ele.id !== job.id))
                        break;
                    }
                }
            }
        )
        .subscribe()

    getDeviceTypes()
    getTypes()
    return () => {
      channel.unsubscribe()
    };
  }, [])


  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const arrival = arrivalDate?.toISOString() ?? ""
    const delevery = delieveryDate?.toISOString() ?? ""
    let data: any = {}
    for (const [key, value] of formData.entries()) {
      if(value.toString().trim() === "") {
        toast.error("أحد الحقول فارغة!")
        return
      }
      data[key] = value;
    }
    if(arrival.trim() == "" || delevery.trim() == ""){
      toast.error("أحد الحقول فارغة!")
      return
    }
    data['date_of_arrival'] = arrival
    data['date_of_delivery'] = delevery
    const { error } = await supabase
      .from('jobs')
      .insert([data])
    console.log(error)
    if(error)
      toast.error("حدث خطأ ما!")
    else
      toast.success("تمت الإضافة")
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const arrival = arrivalDate?.toISOString() ?? ""
    const delevery = delieveryDate?.toISOString() ?? ""
    let data: any = {}
    for (const [key, value] of formData.entries()) {
      if(value.toString().trim() === "") {
        toast.error("أحد الحقول فارغة!")
        return
      }
      data[key] = value;
    }
    if(arrival.trim() == "" || delevery.trim() == ""){
      toast.error("أحد الحقول فارغة!")
      return
    }
    data['date_of_arrival'] = arrival
    data['date_of_delivery'] = delevery
    const { error } = await supabase
      .from('jobs')
      .update(data)
      .eq('id', data.id)
    console.log(error)
    if(error)
      toast.error("حدث خطأ ما!")
    else
      toast.success("تم التعديل")
  }

  return (
     <div className="w-screen h-screen">
        <Nav>
        <div className="flex gap-x-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                    <Search /> بحث
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* TO DO LATER */}
              </DialogContent>
            </Dialog>


            <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setArriavalDate(undefined)
                      setDelieveryDate(undefined)
                    }}
                  >
                      <Plus /> إضافة
                  </Button>
                </DialogTrigger>
              <DialogContent className="min-w-fit">
                <form onSubmit={handleAdd}>
                  <DialogHeader>
                    <DialogTitle>إضافةبيانات جديدة</DialogTitle>
                    <DialogDescription>إملأ الحقول المطلوبة لإضافة بيانات جديدة</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="flex gap-x-2">
                      <Label htmlFor="device_name">اسم الجهاز</Label>
                      <Input id="device_name" name="device_name" placeholder="ادخل اسم الجهاز" />
                    </div>
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label>النوع</Label>
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
                        <Label>الحالة</Label>
                        <Select name="status">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>الحالات</SelectLabel>
                              {status.map(ele => 
                                <SelectItem key={ele} value={ele}>{ele}</SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <Label htmlFor="attachments">المرفقات</Label>
                      <Input id="attachments" name="attachments" placeholder="ادخل المرفقات" />
                    </div>
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label htmlFor="owning_entity">الجهة المالكة</Label>
                        <Input id="owning_entity" name="owning_entity" placeholder="ادخل الجهة المالكة" />
                      </div>
                      <div className="flex gap-x-2">
                        <Label htmlFor="executing_entity">الجهة المنفذة</Label>
                        <Input id="executing_entity" name="executing_entity" placeholder="ادخل الجهة المنفذة" />
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <Label htmlFor="notes">الملاحظات</Label>
                      <Input id="notes" name="notes" placeholder="ادخل ملاحظاتك" />
                    </div>
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
                                setArriavalDate(date)
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
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label htmlFor="cost">التكلفة</Label>
                        <Input id="cost" name="cost" placeholder="ادخل التكلفة" />
                      </div>
                      <div className="flex gap-x-2">
                        <Label htmlFor="phone_number">رقم الهاتف</Label>
                        <Input id="phone_number" name="phone_number" placeholder="ادخل رقم الهاتف" />
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label htmlFor="system_version">نظام التشغيل</Label>
                        <Input id="system_version" name="system_version" placeholder="ادخل اسم النظام" />
                      </div>
                      <div className="flex gap-x-2">
                        <Label htmlFor="device_password">كلمة السر</Label>
                        <Input id="device_password" name="device_password" placeholder="ادخل كلمة السر" />
                      </div>
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
            </Dialog>
        </div>
      </Nav>
        <div className="p-3">
          <Table>
            <TableCaption>تصفح قائمة الأنواع</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/16">اسم الجهاز</TableHead>
                <TableHead className="w-1/16">نوع الجهاز</TableHead>
                <TableHead className="w-1/16">الجهة المالكة</TableHead>
                <TableHead className="w-1/16">الجهة المنفذة</TableHead>
                <TableHead className="w-1/16">تاريخ الوصول</TableHead>
                <TableHead className="w-1/16">تاريخ التسليم</TableHead>
                <TableHead className="w-1/16">الحالة</TableHead>
                <TableHead className="w-1/16">التكلفة</TableHead>
                <TableHead className="w-1/16">المرفقات</TableHead>
                <TableHead className="w-1/16">الملاحظات</TableHead>
                <TableHead className="w-1/16">رقم الهاتف</TableHead>
                <TableHead className="w-1/16">كلمة السر</TableHead>
                <TableHead className="w-1/16">نظام التشغيل</TableHead>
                <TableHead className="w-1/16">تاريخ الاضافة</TableHead>
                <TableHead className="w-1/16">تاريخ التعديل</TableHead>
                <TableHead className="w-1/16">حذف او تعديل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map(ele => (
                <TableRow key={ele.id}>
                    <TableCell className="w-1/16">{ele.device_name}</TableCell>
                    <TableCell className="w-1/16">{ele.device_types.type}</TableCell>
                    <TableCell className="w-1/16">{ele.owning_entity}</TableCell>
                    <TableCell className="w-1/16">{ele.executing_entity}</TableCell>
                    <TableCell className="w-1/16">{new Date(ele.date_of_arrival).toLocaleString('ar-EG')}</TableCell>
                    <TableCell className="w-1/16">{new Date(ele.date_of_delivery).toLocaleString('ar-EG')}</TableCell>
                    <TableCell className="w-1/16">{ele.status}</TableCell>
                    <TableCell className="w-1/16">{ele.cost}</TableCell>
                    <TableCell className="w-1/16">{ele.attachments}</TableCell>
                    <TableCell className="w-1/16">{ele.notes}</TableCell>
                    <TableCell className="w-1/16">{ele.phone_number}</TableCell>
                    <TableCell className="w-1/16">{ele.device_password}</TableCell>
                    <TableCell className="w-1/16">{ele.system_version}</TableCell>
                    <TableCell className="w-1/16">{new Date(ele.created_at).toLocaleString('ar-EG')}</TableCell>
                    <TableCell className="w-1/16">{new Date(ele.updated_at).toLocaleString('ar-EG')}</TableCell>
                    <TableCell className="w-1/16">
                      <DeleteOrEdit ele={ele}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                  className="size-min"
                                  onClick={() => {
                                    setArriavalDate(new Date(ele.date_of_arrival))
                                    setDelieveryDate(new Date(ele.date_of_delivery))
                                  }}
                                >
                                    <Pencil />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-fit">
                              <form onSubmit={handleUpdate}>
                                <DialogHeader>
                                  <DialogTitle>تعديل البيانات</DialogTitle>
                                  <DialogDescription>عدل الحقول التالية واحفظ التعديل</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-2">
                                  <input name="id" defaultValue={ele.id} hidden/>
                                  <div className="flex gap-x-2">
                                    <Label htmlFor="device_name">اسم الجهاز</Label>
                                    <Input id="device_name" name="device_name" placeholder="ادخل اسم الجهاز" defaultValue={ele.device_name} />
                                  </div>
                                  <div className="flex gap-x-2">
                                    <div className="flex gap-x-2">
                                      <Label>النوع</Label>
                                      <Select name="device_type_id" defaultValue={ele.device_types.id}>
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
                                      <Label>الحالة</Label>
                                      <Select name="status" defaultValue={ele.status}>
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectLabel>الحالات</SelectLabel>
                                            {status.map(ele => 
                                              <SelectItem key={ele} value={ele}>{ele}</SelectItem>
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex gap-x-2">
                                    <Label htmlFor="attachments">المرفقات</Label>
                                    <Input id="attachments" name="attachments" placeholder="ادخل المرفقات" defaultValue={ele.attachments}/>
                                  </div>
                                  <div className="flex gap-x-2">
                                    <div className="flex gap-x-2">
                                      <Label htmlFor="owning_entity">الجهة المالكة</Label>
                                      <Input id="owning_entity" name="owning_entity" placeholder="ادخل الجهة المالكة" defaultValue={ele.owning_entity}/>
                                    </div>
                                    <div className="flex gap-x-2">
                                      <Label htmlFor="executing_entity">الجهة المنفذة</Label>
                                      <Input id="executing_entity" name="executing_entity" placeholder="ادخل الجهة المنفذة" defaultValue={ele.executing_entity}/>
                                    </div>
                                  </div>
                                  <div className="flex gap-x-2">
                                    <Label htmlFor="notes">الملاحظات</Label>
                                    <Input id="notes" name="notes" placeholder="ادخل ملاحظاتك" defaultValue={ele.notes} />
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
                                              setArriavalDate(date)
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
                                      <Input id="cost" type="number" name="cost" placeholder="ادخل التكلفة" defaultValue={ele.cost}/>
                                    </div>
                                    <div className="flex gap-x-2">
                                      <Label htmlFor="phone_number">رقم الهاتف</Label>
                                      <Input id="phone_number" name="phone_number" placeholder="ادخل رقم الهاتف" defaultValue={ele.phone_number}/>
                                    </div>
                                  </div>
                                  <div className="flex gap-x-2">
                                    <div className="flex gap-x-2">
                                      <Label htmlFor="system_version">نظام التشغيل</Label>
                                      <Input id="system_version" name="system_version" placeholder="ادخل اسم النظام" defaultValue={ele.system_version}/>
                                    </div>
                                    <div className="flex gap-x-2">
                                      <Label htmlFor="device_password">كلمة السر</Label>
                                      <Input id="device_password" name="device_password" placeholder="ادخل كلمة السر" defaultValue={ele.device_password}/>
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
                        </Dialog>
                      </DeleteOrEdit>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    </div>
  )
}

export default WorksAdministrate