import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import devices from "../assets/devices.jpg"
import dataEntry from "../assets/data_entry.jpeg"

const Main = () => {
  const navigate = useNavigate()
  return (
    <div
      className="w-screen h-screen"
    >
      <Nav
      />
      <div
        className="w-screen p-3 flex justify-around items-start"
      >
        <Card className="w-[45%] bg-transparent">
        <CardHeader>
          <CardTitle>الأجهزة</CardTitle>
          <CardDescription>تصفح انواع الأجهزة</CardDescription>
          <CardAction>
            <Button 
              className="size-10 rounded-full"
              onClick={() => navigate('/types')}
            >
              <ChevronLeft strokeWidth={4}/>
            </Button>
          </CardAction>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-2xl opacity-90 h-100 w-full"
              src={devices}
            />
          </CardContent>
        </Card>
        <Card className="w-[45%] bg-transparent">
          <CardHeader>
            <CardTitle className="pr-2">الأعمال</CardTitle>
            <CardDescription>تصفح الأعمال</CardDescription>
            <CardAction>
              <Button 
                className="size-10 rounded-full"
                onClick={() => navigate('/works')}
              >
                <ChevronLeft strokeWidth={4}/>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-2xl opacity-90 h-100 w-full"
              src={dataEntry}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Main