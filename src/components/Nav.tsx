import supabase from "@/lib/supabase"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useState, type ReactNode } from "react"
import FormButton from "./FormButton"
import { House, LoaderCircle, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Nav = ({children} : {
    children?: ReactNode
}) => {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if(error)
        toast.error('شيء ما خاطئ!')
    setOpen(false)
  }

  return (
    <div className="w-screen flex justify-between p-3">
        <div>    
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button 
                    className="bg-[#988561]"
                    >
                        <LogOut />
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
            {children &&
                <Button
                    className="mr-1 bg-[#988561]"
                    onClick={() => navigate('/')}
                >
                    <House />
                </Button>
            }
        </div>
        {children}
    </div>
  )
}

export default Nav