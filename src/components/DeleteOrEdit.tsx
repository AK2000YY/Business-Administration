import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import type { Work } from "@/types/work"
import type { DeviceType } from "@/types/device_type"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useEffect, useState, type ReactNode } from "react"
import supabase from "@/lib/supabase"
import { toast } from "sonner"
import type { Service } from "@/types/service"

type ELemetType = {
  id: string,
  tableName: 'jobs' | 'device_types' | 'services',
  elementName: string
}


const DeleteOrEdit = ({children,ele}: {
  children?: ReactNode,
  ele: Work | DeviceType | Service
}) => {

  const [element, setElement] = useState<ELemetType>()

  useEffect(() => {
    if('owning_entity' in ele)
      setElement({id: ele.id, tableName: 'jobs', elementName: ele.device_name})
    else if('type' in ele)
      setElement({id: ele.id, tableName: 'device_types', elementName: ele?.type})
    else
      setElement({id: ele.id, tableName: 'services', elementName: ele.service})
  }, [])

  const handleDelete = async () => {
    const { error } = await supabase
      .from(element!.tableName)
      .delete()
      .eq('id', element!.id)
    if(error)
      toast.error("حدث خطأ ما!")
    else
      toast.success("تمت عملية الحذف بنجاح")
  }

  return (
    <div className="flex gap-x-1 justify-center">
        
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="size-min bg-[#165D4E]">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        حذف
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        هل انت تريد حذف {element?.elementName}؟
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                    >
                        نعم
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {children}
        
    </div>
  )
}

export default DeleteOrEdit