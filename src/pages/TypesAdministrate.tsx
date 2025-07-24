import DeleteOrEdit from "@/components/DeleteOrEdit"
import Loader from "@/components/loader"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import supabase from "@/lib/supabase"
import type { DeviceType } from "@/types/device_type"
import { Pencil, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"


const TypesAdministrate = () => {
  const [search, setSearch] = useState<string>('')
  const [load, setLoading] = useState<boolean>(true)
  const [types, setTypes] = useState<DeviceType[]>([])

  useEffect(() => {
    const getTypes = async () => {
      const { data, error } = await supabase
        .from('device_types')
        .select('*')
      console.log(data)
      if(error)
        toast.error("حدث خطأ ما!")
      else
        setTypes(data ?? [])
      setLoading(false)
    }

    const channel = supabase
        .channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'device_types' },
            ({ eventType, old, new: newData }) => {
                console.log(eventType)
                switch (eventType) {
                    case "INSERT": {
                        const deviceType: DeviceType = newData as DeviceType
                        setTypes(prev => [...prev, deviceType])
                        break;
                    }
                    case "UPDATE": {
                        const deviceType: DeviceType = newData as DeviceType
                        setTypes(prev => prev.map(ele => ele.id === deviceType.id ? deviceType : ele))
                        break;
                    }
                    case "DELETE": {
                        const deviceType: DeviceType = old as DeviceType
                        setTypes(prev => prev.filter(ele => ele.id !== deviceType.id))
                        break;
                    }
                }
            }
        )
        .subscribe()

    getTypes()
    return () => {
      channel.unsubscribe()
    };
  }, [])

  const handleAdd = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type')?.toString() ?? ""
    if(type == "")
      toast.error("أحد الحقول فارغة!")
    else {
      const { error } = await supabase
        .from('device_types')
        .insert([
          { type: type },
        ])
      if(error)
         toast.error("شيء ما خاطىء!")
      else
        toast.success("تمت الإضافة")
    }
  }

  const handleUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type')?.toString() ?? ""   
    const id = formData.get('id')?.toString() ?? ""
    if(type == "")
      toast.error("أحد الحقول فارغة!")
    else {
      const { error } = await supabase
        .from('device_types')
        .update({ type: type })
        .eq('id', id)
      if(error)
         toast.error("شيء ما خاطىء!")
      else
        toast.success("تم حفظ التعديلات")
    }
  }

  const handleSearch = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from('device_types')
      .select('*')
      .textSearch('type', search)
    setTypes(data ?? [])
    console.log('ak2', data)
    if(error)
      toast.error("شيء ما خاطىء!")
    else
      toast.success(`تم العثور على ${data.length} عنصر`)
    setLoading(false)
  }
  
  return (
    <div className="w-screen h-screen">
      <Nav>
            <form className="flex gap-x-1 pr-12" onSubmit={handleSearch}>
              <Input name="search" placeholder="ادخل ماتريد البحث عنه" value={search} onChange={(e) => setSearch(e.target.value)}/>
              <Button>
                  <Search />
              </Button>
            </form>


            <Dialog>
                <DialogTrigger asChild>
                  <Button
                  >
                      إضافة نوع جديد <Plus />
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAdd}>
                  <DialogHeader>
                    <DialogTitle>إضافة نوع جديد</DialogTitle>
                    <DialogDescription>إملأ الحقول المطلوبة لإضافة نوع جديد</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">النوع</Label>
                      <Input id="type" name="type" placeholder="ادخل النوع" />
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
      </Nav>
      <div className="p-3">
        {load &&
          <Loader /> 
        }
        {!load &&
          <Table>
            <TableCaption>تصفح قائمة الأنواع</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">النوع</TableHead>
                  <TableHead className="w-1/4">تاريخ الإضافة</TableHead>
                  <TableHead className="w-1/4">تاريخ التعديل</TableHead>
                  <TableHead className="w-1/4">حذف أو تعديل</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
            {types.map(ele => (
              <TableRow key={ele.id}>
                  <TableCell className="w-1/4">{ele.type}</TableCell>
                  <TableCell className="w-1/4">{new Date(ele.created_at).toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="w-1/4">{new Date(ele.updated_at).toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="w-1/4">
                    <DeleteOrEdit ele={ele}>
                      <Dialog>
                          <DialogTrigger asChild>
                              <Button className="size-min">
                                  <Pencil />
                              </Button>
                          </DialogTrigger>
                          <DialogContent>
                          <form onSubmit={handleUpdate}>
                            <DialogHeader>
                              <DialogTitle>تعديل</DialogTitle>
                              <DialogDescription>إملأ الحقول لتعديل {ele.type}</DialogDescription>
                            </DialogHeader>
                            <Input hidden name="id" defaultValue={ele.id}/>
                            <div className="grid gap-4 py-2">
                              <div className="grid gap-3">
                                <Label htmlFor="name-1">النوع</Label>
                                <Input id="type" name="type" placeholder="ادخل النوع" defaultValue={ele.type}  />
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
        }
      </div>
    </div>
  )
}

export default TypesAdministrate