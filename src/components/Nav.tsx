import supabase from "@/lib/supabase"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import type { ReactNode } from "react"

const Nav = ({children} : {
    children?: ReactNode
}) => {

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if(error)
        toast.error('شيء ما خاطئ!')
  }

  return (
    <div className="w-screen flex justify-between p-3">
        <AlertDialog>
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
                    <AlertDialogAction
                        onClick={handleLogout}
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

export default Nav