import type { ReactNode } from "react"
import { Button } from "./ui/button"
import { useFormStatus } from "react-dom"

const FormButton = ({name, children} : {
    name: string,
    children: ReactNode
}) => {

  const {pending} = useFormStatus()

  return (
    <Button disabled={pending} type="submit">
        {name} {pending && children}
    </Button>
  )
}

export default FormButton