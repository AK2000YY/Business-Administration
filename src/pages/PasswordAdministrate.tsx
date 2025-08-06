import DeleteOrEdit from "@/components/DeleteOrEdit";
import FormPasswordAdd from "@/components/FormPasswordAdd";
import FormPasswordUpdate from "@/components/FormPasswordUpdate";
import Loader from "@/components/loader";
import Nav from "@/components/Nav";
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
import supabase from "@/lib/supabase";
import type { Password } from "@/types/password";
import { Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PasswordAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [load, setLoading] = useState<boolean>(true);
  const [passwords, setPasswords] = useState<Password[]>([]);

  useEffect(() => {
    const getTypes = async () => {
      const { data, error } = await supabase.from("passwords").select("*");
      console.log(data);
      if (error) toast.error("حدث خطأ ما!");
      else setPasswords(data ?? []);
      setLoading(false);
    };

    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "passwords" },
        ({ eventType, old, new: newData }) => {
          console.log(eventType);
          switch (eventType) {
            case "INSERT": {
              const data: Password = newData as Password;
              console.log(data);
              setPasswords((prev) => [...prev, data]);
              break;
            }
            case "UPDATE": {
              const data: Password = newData as Password;
              setPasswords((prev) =>
                prev.map((ele) => (ele.id === data.id ? data : ele))
              );
              break;
            }
            case "DELETE": {
              const data: Password = old as Password;
              setPasswords((prev) => prev.filter((ele) => ele.id !== data.id));
              break;
            }
          }
        }
      )
      .subscribe();

    getTypes();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data: any = {};

    const type = formData.get("type")?.toString().trim();

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString().trim().length == 0 ? null : value;
      if (key == "file" && type == "لينيكس") continue;
      if (!data[key]) {
        toast.error("احد الحقول المطلوبة فارغة!");
        return;
      }
    }

    const { error } = await supabase.from("passwords").insert([data]);

    if (error) toast.error("شيء ما خاطىء");
    else toast.success("تمت الإضافة");
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data: any = {};

    const type = formData.get("type")?.toString().trim();

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString().trim().length == 0 ? null : value;
      if (key == "file" && type == "لينيكس") continue;
      if (!data[key]) {
        toast.error("احد الحقول المطلوبة فارغة!");
        return;
      }
    }

    const { error } = await supabase
      .from("passwords")
      .update([data])
      .eq("id", data["id"]);

    if (error) toast.error("شيء ما خاطىء");
    else toast.success("تم التعديل");
    console.log(error);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("passwords")
      .select("*")
      .eq("number", Number(search));
    setPasswords(data ?? []);
    if (error) toast.error("شيء ما خاطىء!");
    else toast.success(`تم العثور على ${data.length} عنصر`);
    console.log(error);
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen">
      <Nav>
        <form className="flex gap-x-1 pr-15" onSubmit={handleSearch}>
          <Input
            name="search"
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
              إضافة كلمة مرور <Plus />
            </Button>
          </DialogTrigger>
          <FormPasswordAdd onAdd={handleAdd} />
        </Dialog>
      </Nav>
      <div className="p-3">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح كلمات السر</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/8">رقم الكلمة</TableHead>
                <TableHead className="w-1/8">النوع</TableHead>
                <TableHead className="w-1/8">النظام</TableHead>
                <TableHead className="w-1/8">المستخدم</TableHead>
                <TableHead className="w-1/8">تشفير ملف</TableHead>
                <TableHead className="w-1/8">البيوس</TableHead>
                <TableHead className="w-1/8">التجميد</TableHead>
                <TableHead className="w-1/8">تعديل او حذف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwords.map((ele) => (
                <TableRow key={ele.id}>
                  <TableCell className="w-1/8">{ele.number}</TableCell>
                  <TableCell className="w-1/8">{ele.type}</TableCell>
                  <TableCell className="w-1/8">
                    {ele.system ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/8">
                    {ele.username ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/8">
                    {ele.file ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/8">
                    {ele.bios ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/8">{ele.ice ?? "لايوجد"}</TableCell>
                  <TableCell className="w-1/8">
                    <DeleteOrEdit ele={ele}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="size-min bg-[#165D4E]">
                            <Pencil />
                          </Button>
                        </DialogTrigger>
                        <FormPasswordUpdate
                          password={ele}
                          onUpdate={handleUpdate}
                        />
                      </Dialog>
                    </DeleteOrEdit>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PasswordAdministrate;
