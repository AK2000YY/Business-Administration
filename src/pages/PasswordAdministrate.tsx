import DeleteOrEdit from "@/components/DeleteOrEdit";
import FormPasswordAdd from "@/components/FormPasswordAdd";
import FormPasswordUpdate from "@/components/FormPasswordUpdate";
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
import supabase from "@/lib/supabase";
import type { Password } from "@/types/password";
import { Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PasswordAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [load, setLoading] = useState<boolean>(true);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [end, setEnd] = useState<number>(14);
  const [dialogKey, setDialogKey] = useState<number>(0);

  useEffect(() => {
    const getTypes = async () => {
      const { data, error } = await supabase
        .from("passwords")
        .select("*")
        .neq("is_used", false)
        .range(end - 14, end)
        .order("number");
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
              setPasswords((prev) => {
                if (prev.length < 15) return [...prev, data];
                else return prev;
              });
              break;
            }
            case "UPDATE": {
              const data: Password = newData as Password;
              setPasswords((prev) =>
                prev.map((ele) => (ele.id === data.id ? data : ele))
              );
              setPasswords((prev) => prev.filter((ele) => ele.is_used));
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
  }, [end]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString().trim().length == 0 ? null : value;
      if (
        (key == "ice" || key == "bios") &&
        (isNaN(Number(value)) || !(Number(value) <= 20 && Number(value) >= 1))
      ) {
        toast.error("البيوس او التجميد يجب ان يكون بين 1 و 20!");
        return;
      }
    }

    data["is_used"] = true;

    const password = await supabase
      .from("passwords")
      .select("*")
      .eq("number", data["number"])
      .eq("is_used", false);

    if (password.error) {
      toast.error("شيء ما خاطىء");
      return;
    } else if (password.data.length == 0) {
      toast.error("الرقم ليس ضمن المجال المعين");
      return;
    } else {
      if (
        password.data[0].number != data["number"] ||
        password.data[0].type != data["type"]
      ) {
        toast.error("الرقم ليس ضمن المجال المعين");
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from("passwords")
      .delete()
      .eq("number", data["number"]);

    if (deleteError) {
      toast.error("شيء ما خاطىء");
      return;
    }

    const { error } = await supabase.from("passwords").insert([data]);

    if (error) toast.error("شيء ما خاطىء");
    else toast.success("تمت الإضافة");
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString().trim().length == 0 ? null : value;
      if (
        (key == "ice" || key == "bios") &&
        (isNaN(Number(value)) || !(Number(value) <= 20 && Number(value) >= 1))
      ) {
        toast.error("البيوس او التجميد يجب ان يكون بين 1 و 20!");
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
      .eq("number", Number(search))
      .eq("is_used", true);
    setPasswords(data ?? []);
    if (error) toast.error("شيء ما خاطىء!");
    else toast.success(`تم العثور على ${data.length} عنصر`);
    console.log(error);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
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
            <Button
              className="bg-[#165D4E]"
              onClick={() => setDialogKey((prev) => (prev + 1) % 2)}
            >
              إضافة كلمة مرور <Plus />
            </Button>
          </DialogTrigger>
          <FormPasswordAdd key={dialogKey} onAdd={handleAdd} />
        </Dialog>
      </Nav>
      <div className="flex-1 overflow-y-auto relative">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح كلمات السر</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/10">رقم الكلمة</TableHead>
                <TableHead className="w-1/10">النوع</TableHead>
                <TableHead className="w-1/10">النظام</TableHead>
                <TableHead className="w-1/10">المستخدم</TableHead>
                <TableHead className="w-1/10">تشفير ملف أنكليزي</TableHead>
                <TableHead className="w-1/10">تشفير ملف عربي</TableHead>
                <TableHead className="w-1/10">البيوس</TableHead>
                <TableHead className="w-1/10">التجميد</TableHead>
                <TableHead className="w-1/10">القفل</TableHead>
                <TableHead className="w-1/10">تعديل او حذف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwords.map((ele) => (
                <TableRow key={ele.id}>
                  <TableCell className="w-1/10">{ele.number}</TableCell>
                  <TableCell className="w-1/10">{ele.type}</TableCell>
                  <TableCell className="w-1/10">
                    {ele.system ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
                    {ele.username ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
                    {ele.file ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
                    {ele.file_arabic ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
                    {ele.bios ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
                    {ele.ice ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
                    {ele.lock ?? "لايوجد"}
                  </TableCell>
                  <TableCell className="w-1/10">
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

export default PasswordAdministrate;
