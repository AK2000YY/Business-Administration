import supabase from "@/lib/supabase"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useState, type ReactNode } from "react"
import FormButton from "./FormButton"
import { LoaderCircle } from "lucide-react"

const Nav = ({children} : {
    children?: ReactNode
}) => {

  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if(error)
        toast.error('شيء ما خاطئ!')
    setOpen(false)
  }

  return (
    <div className="w-screen flex justify-between p-3">
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button 
                className="bg-red-600"
                >
                    تسجيل الخروج
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        تسجيل الخروج
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        هل انت تريد تسجيل الخروج
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <form action={handleLogout}>
                        <FormButton
                            name="نعم"
                        >
                            <LoaderCircle className="animate-spin text-[#988561]" />
                        </FormButton>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        {children}
    </div>
  )
}

export default Nav