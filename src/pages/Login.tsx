import { LoginForm } from "@/components/login-form"
import supabase from "@/lib/supabase";
import { toast } from "sonner";

const Login = () => {

  const handleSubmit = async ({username, password } : { username: string; password: string }) => {
    if(username == "" || password == "")
      toast.error("أحد الحقول فارغة!")
    
    else {

      let { error } = await supabase.auth.signInWithPassword({
        email: username + '@gmail.com',
        password: password
      })
      
      if(error) {
        console.log(error)
        toast.error("شيء ما خاطئ!")
      }
      else
        toast.success("تم تسجيل الدخول")
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LoginForm 
        className="w-100"
        submit={handleSubmit}
      />
    </div>
  )
}

export default Login