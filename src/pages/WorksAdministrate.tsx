import DeleteOrEdit from "@/components/DeleteOrEdit"
import FormDeviceAdd from "@/components/FormDeviceAdd"
import FormDeviceUpdate from "@/components/FormDeviceUpdate"
import FromServiceAdd from "@/components/FormServiceAdd"
import FormServiceEdit from "@/components/FormServiceEdit"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import supabase from "@/lib/supabase"
import { type DeviceType } from "@/types/device_type"
import type { Service } from "@/types/service"
import type { Work } from "@/types/work"
import { HandHelping, Pencil, Plus, Search } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { toast } from "sonner"

const WorksAdministrate = () => {
  
  const [search, setSearch] = useState<string>('')
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
        .select('*, device_types(*), services(*)')
      console.log(error)
      console.log('akkkkk,', data)
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

    // const deviceChannel = supabase
    //     .channel('custom-all-channel')
    //     .on(
    //         'postgres_changes',
    //         { event: '*', schema: 'public', table: 'jobs' },
    //         async ({ eventType, old, new: newData }) => {
    //             console.log(eventType)
    //             switch (eventType) {
    //                 case "INSERT":
    //                 case "UPDATE": {
    //                   const { data } = await supabase
    //                     .from('jobs')
    //                     .select('*, device_types(type), services(*)')
    //                     .eq('id', newData.id)
    //                     .single()

    //                   if (data) {
    //                     setWorks(prev =>
    //                       prev.some(job => job.id === data.id)
    //                         ? prev.map(job => job.id === data.id ? data : job)
    //                         : [...prev, data]
    //                     )
    //                   }
    //                   break;
    //                 }

    //                 case "DELETE": {
    //                     const job: Work = old as Work
    //                     setWorks(prev => prev.filter(ele => ele.id !== job.id))
    //                     break;
    //                 }
    //             }
    //         }
    //     )
    //     .subscribe()
    
    // const serviceChannel = supabase.channel('custom-all-channel')
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'public', table: 'services' },
    //     async ({ eventType, old, new: newData }) => {
    //         console.log(eventType)
    //         switch (eventType) {
    //             case "INSERT": {
    //                 const service: Service = newData as Service
    //                 setTypes(prev => [...prev, deviceType])
    //                 break;
    //             }
    //             case "UPDATE": {
    //                 const service: Service = newData as Service
    //                 setTypes(prev => prev.map(ele => ele.id === deviceType.id ? deviceType : ele))
    //                 break;
    //             }
    //             case "DELETE": {
    //                 const service: Service = old as Service
    //                 setWorks(prev =>  )
    //                 break;
    //             }
    //         }
    //     }
    //   )
    //   .subscribe()


    // getDeviceTypes()
    // getTypes()
    // return () => {
    //   deviceChannel.unsubscribe()
    //   serviceChannel.unsubscribe()
    // };
  }, [])


  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    let data: any = {}
    for (const [key, value] of formData.entries()) {
      if(value.toString().trim() === "") {
        toast.error("أحد الحقول فارغة!")
        return
      }
      data[key] = value;
    }
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
    let data: any = {}
    for (const [key, value] of formData.entries()) {
      if(value.toString().trim() === "") {
        toast.error("أحد الحقول فارغة!")
        return
      }
      data[key] = value;
    }
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

  const handleEditService = async (e: React.FormEvent<HTMLFormElement>) => {
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
      .from('services')
      .update(data)
      .eq('id', data.id)
    console.log(error)
    if(error)
      toast.error("حدث خطأ ما!")
    else
      toast.success("تم التعديل")
  }

  const handleServiceAdd = async (e: React.FormEvent<HTMLFormElement>) => {
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
    console.log(data)
    const { error } = await supabase
      .from('services')
      .insert([data])
    console.log(error)
    if(error)
      toast.error("حدث خطأ ما!")
    else
      toast.success("تمت الإضافة")
  }

  const handleSearch = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('jobs')
      .select('*, device_types(*), services(*)')
      .textSearch('tsv', search)
    setWorks(data ?? [])
    console.log('ak2', data)
    if(error)
      toast.error("شيء ما خاطىء!")
  }

  return (
     <div className="w-screen h-screen">
        <Nav>
            <form className="flex gap-x-1 pr-12" onSubmit={handleSearch}>
              <Input name="search" type="text" placeholder="ادخل ماتريد البحث عنه" value={search} onChange={(e) => setSearch(e.target.value)}/>
              <Button>
                  <Search />
              </Button>
            </form>
            <Dialog>
                <DialogTrigger asChild>
                  <Button
                  >
                      إضافة جهاز جديد <Plus />
                  </Button>
                </DialogTrigger>
              <FormDeviceAdd
                types={types}
                handleAdd={handleAdd} 
              />
            </Dialog>
      </Nav>
        <div className="p-3">
          <Table>
            <TableCaption>تصفح قائمة الأنواع</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/14">الرقم التسلسلي</TableHead>
                <TableHead className="w-1/14">اسم الجهاز</TableHead>
                <TableHead className="w-1/14">نوع الجهاز</TableHead>
                <TableHead className="w-1/14">الجهة المالكة</TableHead>
                <TableHead className="w-1/14">الجهة المنفذة</TableHead>
                <TableHead className="w-1/14">تاريخ الوصول</TableHead>
                <TableHead className="w-1/14">تاريخ التسليم</TableHead>
                <TableHead className="w-1/14">الحالة</TableHead>
                <TableHead className="w-1/14">التكلفة</TableHead>
                <TableHead className="w-1/14">المرفقات</TableHead>
                <TableHead className="w-1/14">الملاحظات</TableHead>
                <TableHead className="w-1/14">رقم الهاتف</TableHead>
                <TableHead className="w-1/14">كلمة السر</TableHead>
                <TableHead className="w-1/14">نظام التشغيل</TableHead>
                <TableHead className="w-1/14">حذف او تعديل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map(ele => (
                <Fragment key={ele.id}>
                  <TableRow className="bg-[#988561]/30">
                    <TableCell className="w-1/14">{ele.serial}</TableCell>
                    <TableCell className="w-1/14">{ele.device_name}</TableCell>
                    <TableCell className="w-1/14">{ele.device_types.type}</TableCell>
                    <TableCell className="w-1/14">{ele.owning_entity}</TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14">{ele.notes}</TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14"></TableCell>
                    <TableCell className="w-1/14">
                      <DeleteOrEdit ele={ele}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                  className="size-min bg-[#988561]"
                                >
                                    <Pencil />
                                </Button>
                            </DialogTrigger>
                            <FormDeviceUpdate
                              types={types}
                              device={ele}
                              onUpdate={handleUpdate} 
                            />
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                  className="size-min bg-[#988561]"
                                  onClick={() => {
                                    setArriavalDate(undefined)
                                    setDelieveryDate(undefined)
                                  }}
                                >
                                    <HandHelping />
                                </Button>
                            </DialogTrigger>
                            <FromServiceAdd
                              arrivalOpen={arrivalOpen}
                              arrivalDate={arrivalDate}
                              delieveryOpen={delieveryOpen}
                              delieveryDate={delieveryDate}
                              setArrivalOpen={setArrivalOpen}
                              setArrivalDate={setArriavalDate}
                              setDelieveryOpen={setDelieveryOpen}
                              setDelieveryDate={setDelieveryDate}
                              job_id={ele.id}
                              onAdd={handleServiceAdd}
                            />
                        </Dialog>
                      </DeleteOrEdit>
                    </TableCell>
                  </TableRow>
                  {ele.services.length > 0 &&
                    ele.services.map(subele => 
                      <TableRow key={subele.id}>
                        <TableCell className="w-1/14">{ele.serial}</TableCell>
                        <TableCell className="w-1/14">{ele.device_name}</TableCell>
                        <TableCell className="w-1/14">{ele.device_types.type}</TableCell>
                        <TableCell className="w-1/14">{ele.owning_entity}</TableCell>
                        <TableCell className="w-1/14">{subele.executing_entity}</TableCell>
                        <TableCell className="w-1/14">{new Date(subele.date_of_arrival).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell className="w-1/14">{new Date(subele.date_of_delivery).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell className="w-1/14">{subele.service}</TableCell>
                        <TableCell className="w-1/14">{subele.cost}</TableCell>
                        <TableCell className="w-1/14">{subele.attachments}</TableCell>
                        <TableCell className="w-1/14">{subele.notes}</TableCell>
                        <TableCell className="w-1/14">{subele.phone_number}</TableCell>
                        <TableCell className="w-1/14">{subele.device_password}</TableCell>
                        <TableCell className="w-1/14">{subele.system_version}</TableCell>
                        <TableCell className="w-1/14">
                          <DeleteOrEdit ele={subele}>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                      className="size-min bg-[#988561]"
                                      onClick={() => {
                                        setArriavalDate(new Date(subele.date_of_arrival))
                                        setDelieveryDate(new Date(subele.date_of_delivery))
                                      }}
                                    >
                                        <Pencil />
                                    </Button>
                                </DialogTrigger>
                                <FormServiceEdit 
                                  arrivalOpen={arrivalOpen}
                                  arrivalDate={arrivalDate}
                                  delieveryOpen={delieveryOpen}
                                  delieveryDate={delieveryDate}
                                  setArrivalOpen={setArrivalOpen}
                                  setArrivalDate={setArriavalDate}
                                  setDelieveryOpen={setDelieveryOpen}
                                  setDelieveryDate={setDelieveryDate}
                                  service={subele}
                                  onUpdate={handleEditService}
                                />
                            </Dialog>
                            <div className="w-10"></div>
                          </DeleteOrEdit>
                        </TableCell>
                      </TableRow>
                    )
                  }
                </Fragment>
              ))}
            </TableBody>
          </Table>
      </div>
    </div>
  )
}

export default WorksAdministrate