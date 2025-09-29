import DeleteOrEdit from "@/components/DeleteOrEdit";
import Loader from "@/components/loader";
import Nav from "@/components/Nav";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAddForm from "@/components/UserAddForm";
import supabase from "@/lib/supabase";
import type { User } from "@/types/user";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UsersAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [end, setEnd] = useState<number>(14);

  useEffect(() => {
    let ignore = false;
    const getUsers = async () => {
      setLoad(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true })
        .neq("role", "ADMIN")
        .range(end - 14, end);
      console.log(data);
      if (ignore) return;
      if (error) toast.error("حدث خطأ ما!");
      else {
        setUsers(data ?? []);
        setLoad(false);
      }
    };

    const deviceChannel = supabase
      .channel("profiles-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        async ({ eventType, old, new: newData }) => {
          console.log(eventType);
          switch (eventType) {
            case "INSERT": {
              const data = newData;
              setUsers((prev: any) => {
                if (prev.length < 15) return [...prev, data];
                else return prev;
              });
              break;
            }
            case "UPDATE": {
              const data = newData;
              setUsers((prev) =>
                prev.map((ele: any) => (ele.id === data.id ? data : ele))
              );
              break;
            }
            case "DELETE": {
              const data = old;
              setUsers((prev) => prev.filter((ele) => ele.id !== data.id));
              break;
            }
          }
        }
      )
      .subscribe();

    getUsers();
    return () => {
      deviceChannel.unsubscribe();
      ignore = true;
    };
  }, [end]);

  const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const confirmPassword = formData.get("confirm-password")?.toString().trim();

    if (!email || !password) {
      toast.error("احد الحقول فارغة");
      return;
    }

    if (password != confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      console.error("User is not logged in");
      return;
    }
    const { error } = await supabase.functions.invoke("create-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        email: email + "@gmail.com",
        password: password,
      },
    });

    if (error) toast.error("حدث خطأ اثناء الانشاء");
    else toast.success("تم الإنشاء بنجاح");
  };

  return (
    <div className="flex flex-col h-screen">
      <Nav>
        <form className="flex gap-x-1 pr-12" onSubmit={() => {}}>
          <Input
            name="search"
            type="text"
            placeholder="ادخل ماتريد البحث عنه"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="bg-[#165D4E]">
            <Search />
          </Button>
        </form>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#165D4E]">
              إضافة مستخدم جديد <Plus />
            </Button>
          </DialogTrigger>
          <UserAddForm onAdd={addUser} />
        </Dialog>
      </Nav>
      <div className="flex-1 overflow-y-auto relative">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح قائمة الأنواع</TableCaption>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-1/20">اسم المستخدم</TableHead>
                <TableHead className="w-1/20">صلاحية المستخدم</TableHead>
                <TableHead className="w-1/20">تاريخ الانشاء</TableHead>
                <TableHead className="w-1/20">حذف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((ele) => (
                <TableRow key={ele.id} className="bg-[#988561]/30">
                  <TableCell className="w-1/20">
                    {ele.email.slice(0, ele.email.lastIndexOf("@"))}
                  </TableCell>
                  <TableCell className="w-1/20">{ele.role}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.created_at
                      ? new Date(ele.created_at).toISOString().split("T")[0]
                      : ""}
                  </TableCell>
                  <TableCell className="w-1/20">
                    <DeleteOrEdit ele={ele}></DeleteOrEdit>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Pagination
        pageNumber={(end - 14) / 15 + 1}
        nextDisable={false}
        previousDisable={end - 14 == 0}
        onNext={() => setEnd(end + 15)}
        onPrevious={() => setEnd(end - 15)}
      />
    </div>
  );
};

export default UsersAdministrate;
