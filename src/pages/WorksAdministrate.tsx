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
        .select('*, device_types(type)')
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
                  >
                      <Plus /> إضافة
                  </Button>
                </DialogTrigger>
              <DialogContent className="min-w-fit">
                <form onSubmit={() => {}}>
                  <DialogHeader>
                    <DialogTitle>إضافة نوع جديد</DialogTitle>
                    <DialogDescription>إملأ الحقول المطلوبة لإضافة نوع جديد</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="flex gap-x-2">
                      <Label htmlFor="name">اسم الجهاز</Label>
                      <Input id="name" name="name" placeholder="ادخل اسم الجهاز" />
                    </div>
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label>النوع</Label>
                        <Select name="type">
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
                      <Label htmlFor="attach">المرفقات</Label>
                      <Input id="attach" name="attach" placeholder="ادخل المرفقات" />
                    </div>
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label htmlFor="owner">الجهة المالكة</Label>
                        <Input id="owner" name="owner" placeholder="ادخل الجهة المالكة" />
                      </div>
                      <div className="flex gap-x-2">
                        <Label htmlFor="executer">الجهة المنفذة</Label>
                        <Input id="executer" name="executer" placeholder="ادخل الجهة المنفذة" />
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
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input id="phone" name="phone" placeholder="ادخل رقم الهاتف" />
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div className="flex gap-x-2">
                        <Label htmlFor="os">نظام التشغيل</Label>
                        <Input id="os" name="os" placeholder="ادخل اسم النظام" />
                      </div>
                      <div className="flex gap-x-2">
                        <Label htmlFor="password">كلمة السر</Label>
                        <Input id="password" name="password" placeholder="ادخل كلمة السر" />
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
                                <Button className="size-min">
                                    <Pencil />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                            <form onSubmit={() => {}}>
                              <DialogHeader>
                                <DialogTitle>تعديل</DialogTitle>
                                <DialogDescription>إملأ الحقول لتعديل {ele.device_name}</DialogDescription>
                              </DialogHeader>
                              <Input hidden name="id" defaultValue={ele.id}/>
                              <div className="grid gap-4 py-2">
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="name-1">النوع</Label>
                                  <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.device_name}  />
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