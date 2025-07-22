import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FormButton from "./FormButton"
import { LoaderCircle } from "lucide-react"

type LoginFormProps = React.ComponentProps<"div"> & {
  submit: ({username, password} : { username: string; password: string}) => void;
};

export function LoginForm({ className, submit, ...props }: LoginFormProps) {

  async function handleSubmit(e: FormData) {
    const username = e.get('username')?.toString() ?? ""
    const password = e.get('password')?.toString() ?? ""
    await submit({username, password})
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/70">
        <CardHeader>
          <CardTitle>تطبيق ادراة الموارد</CardTitle>
          <CardDescription>
            ادخل اسم المستخدم و كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">اسم المستخدم</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="ادخل اسم المستخدم الخاص بك"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">كلمة المرور</Label>
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  placeholder="ادخل كلمة المرور الخاصة بك" 
                />
              </div>
              <div className="flex flex-col gap-3">
                <FormButton name="سجل الدخول">
                  <LoaderCircle className="animate-spin text-[#988561]" />
                </FormButton>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
