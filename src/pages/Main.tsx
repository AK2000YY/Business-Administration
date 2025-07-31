import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import devices from "../assets/devices.jpg";
import dataEntry from "../assets/data_entry.jpeg";
import cpuImage from "../assets/cpu.png";
import passwordImage from "../assets/password.png";

const Main = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col">
      <Nav />
      <div className="w-screen flex flex-wrap grow justify-around items-start gap-y-2 overflow-y-auto">
        <Card className="w-[45%] bg-transparent">
          <CardHeader>
            <CardTitle>انواع الاجهزة</CardTitle>
            <CardDescription>تصفح انواع الأجهزة</CardDescription>
            <CardAction>
              <Button
                className="size-10 rounded-full"
                onClick={() => navigate("/types")}
              >
                <ChevronLeft strokeWidth={4} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <img className="rounded-2xl opacity-90 h-80 w-full" src={devices} />
          </CardContent>
        </Card>
        <Card className="w-[45%] bg-transparent">
          <CardHeader>
            <CardTitle>أرشيف الأجهزة</CardTitle>
            <CardDescription>تصفح الأجهزة</CardDescription>
            <CardAction>
              <Button
                className="size-10 rounded-full"
                onClick={() => navigate("/works")}
              >
                <ChevronLeft strokeWidth={4} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-2xl opacity-90 h-80 w-full"
              src={dataEntry}
            />
          </CardContent>
        </Card>
        <Card className="w-[45%] bg-transparent">
          <CardHeader>
            <CardTitle>المعالجات</CardTitle>
            <CardDescription>تصفح اسماء المعالجات</CardDescription>
            <CardAction>
              <Button
                className="size-10 rounded-full"
                onClick={() => navigate("/cpus")}
              >
                <ChevronLeft strokeWidth={4} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-2xl opacity-90 h-80 w-full"
              src={cpuImage}
            />
          </CardContent>
        </Card>
        <Card className="w-[45%] bg-transparent">
          <CardHeader>
            <CardTitle>كلمات السر</CardTitle>
            <CardDescription>تصفح كلمات السر</CardDescription>
            <CardAction>
              <Button
                className="size-10 rounded-full"
                onClick={() => navigate("/passwords")}
              >
                <ChevronLeft strokeWidth={4} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-2xl opacity-90 h-80 w-full"
              src={passwordImage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Main;
