import logo from "../assets/logo.svg"
import type { ReactNode } from "react"

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 z-0 flex w-screen h-screen justify-center items-center">
        <img src={logo} className="size-200 object-cover opacity-40" />
      </div>
      <div className="absolute top-0 right-0 w-full h-full z-10">
        {children}
      </div>
    </div>
  )
}

export default Container
