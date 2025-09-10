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
import passwordImage from "../assets/password.png";
import users from "../assets/users.png";
import { useEffect, useState } from "react";
import { userIsAdmin } from "@/permisson/user";

const Main = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function getUserRole() {
      const isAdmin = await userIsAdmin();
      setIsAdmin(isAdmin);
    }
    getUserRole();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Nav />
      <div className="w-screen flex flex-wrap grow justify-around items-start gap-y-2 overflow-y-auto">
        <Card
          className="w-[30%] bg-transparent"
          onClick={() => navigate("/types")}
        >
          <CardHeader>
            <CardTitle>انواع الاجهزة</CardTitle>
            <CardDescription>تصفح انواع الأجهزة</CardDescription>
            <CardAction>
              <Button className="size-10 rounded-full">
                <ChevronLeft strokeWidth={4} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <img className="rounded-2xl opacity-90 h-80 w-full" src={devices} />
          </CardContent>
        </Card>
        <Card
          className="w-[30%] bg-transparent"
          onClick={() => navigate("/works")}
        >
          <CardHeader>
            <CardTitle>أرشيف الأجهزة</CardTitle>
            <CardDescription>تصفح الأجهزة</CardDescription>
            <CardAction>
              <Button className="size-10 rounded-full">
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
        <Card
          className="w-[30%] bg-transparent"
          onClick={() => navigate("/passwords")}
        >
          <CardHeader>
            <CardTitle>كلمات السر</CardTitle>
            <CardDescription>تصفح كلمات السر</CardDescription>
            <CardAction>
              <Button className="size-10 rounded-full">
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
        {isAdmin && (
          <Card
            className="w-[30%] bg-transparent"
            onClick={() => navigate("/users")}
          >
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>تصفح المستخدمين</CardDescription>
              <CardAction>
                <Button className="size-10 rounded-full">
                  <ChevronLeft strokeWidth={4} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <img className="rounded-2xl opacity-90 h-80 w-full" src={users} />
            </CardContent>
          </Card>
        )}
        <Card className="w-[30%] bg-transparent opacity-0"></Card>
        <Card className="w-[30%] bg-transparent opacity-0"></Card>
      </div>
    </div>
  );
};

export default Main;
