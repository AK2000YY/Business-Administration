import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import type { Work } from "@/types/work"
import type { DeviceType } from "@/types/device_type"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useEffect, useState, type ReactNode } from "react"
import supabase from "@/lib/supabase"
import { toast } from "sonner"

type ELemetType = {
  id: string,
  tableName: 'jobs' | 'device_types',
  elementName: string
}


const DeleteOrEdit = ({children,ele}: {
  children?: ReactNode,
  ele: Work | DeviceType
}) => {

  const [element, setElement] = useState<ELemetType>()

  useEffect(() => {
    if('cost' in ele)
      setElement({id: ele.id, tableName: 'jobs', elementName: ele.device_name})
    else
      setElement({id: ele.id, tableName: 'device_types', elementName: ele?.type})
  }, [])

  const handleDelete = async () => {
    const { error } = await supabase
      .from(element!.tableName)
      .delete()
      .eq('id', element!.id)
    if(error)
      toast.error("حدث خطأ ما!")
  }

  return (
    <div className="flex gap-x-1 justify-center">
        
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="size-min bg-red-500 hover:bg-red-400">
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