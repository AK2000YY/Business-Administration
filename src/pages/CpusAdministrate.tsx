import DeleteOrEdit from "@/components/DeleteOrEdit";
import Loader from "@/components/loader";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Cpu } from "@/types/cpu";
import { Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TypesAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [load, setLoading] = useState<boolean>(true);
  const [cpus, setCpus] = useState<Cpu[]>([]);

  useEffect(() => {
    const getCpus = async () => {
      const { data, error } = await supabase.from("cpus").select("*");
      console.log(data);
      if (error) toast.error("حدث خطأ ما!");
      else setCpus(data ?? []);
      setLoading(false);
    };

    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cpus" },
        ({ eventType, old, new: newData }) => {
          console.log(eventType);
          switch (eventType) {
            case "INSERT": {
              const cpu: Cpu = newData as Cpu;
              setCpus((prev) => [...prev, cpu]);
              break;
            }
            case "UPDATE": {
              const cpu: Cpu = newData as Cpu;
              setCpus((prev) =>
                prev.map((ele) => (ele.id === cpu.id ? cpu : ele))
              );
              break;
            }
            case "DELETE": {
              const cpu: Cpu = old as Cpu;
              setCpus((prev) => prev.filter((ele) => ele.id !== cpu.id));
              break;
            }
          }
        }
      )
      .subscribe();

    getCpus();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    if (name == "") toast.error("أحد الحقول فارغة!");
    else {
      const { error } = await supabase.from("cpus").insert([{ name: name }]);
      console.log(error);
      if (error) toast.error("شيء ما خاطىء!");
      else toast.success("تمت الإضافة");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const id = formData.get("id")?.toString() ?? "";
    if (name == "") toast.error("أحد الحقول فارغة!");
    else {
      const { error } = await supabase
        .from("cpus")
        .update({ name: name })
        .eq("id", id);
      if (error) toast.error("شيء ما خاطىء!");
      else toast.success("تم حفظ التعديلات");
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("cpus")
      .select("*")
      .textSearch("cpus", search);
    setCpus(data ?? []);
    console.log("ak2", data);
    if (error) toast.error("شيء ما خاطىء!");
    else toast.success(`تم العثور على ${data.length} عنصر`);
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen">
      <Nav>
        <form className="flex gap-x-1 pr-12" onSubmit={handleSearch}>
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
              إضافة نوع جديد <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>إضافة معالج جديد</DialogTitle>
                <DialogDescription>
                  إملأ الحقول المطلوبة لإضافة معالج جديد
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">النوع</Label>
                  <Input id="name" name="name" placeholder="ادخل اسم المعالج" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">إلغاء</Button>
                </DialogClose>
                <Button type="submit">حفظ</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Nav>
      <div className="p-3">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح قائمة المعالجات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">الاسم</TableHead>
                <TableHead className="w-1/2">حذف أو تعديل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cpus.map((ele) => (
                <TableRow key={ele.id}>
                  <TableCell className="w-1/2">{ele.name}</TableCell>
                  <TableCell className="w-1/2">
                    <DeleteOrEdit ele={ele}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="size-min bg-[#165D4E]">
                            <Pencil />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <form onSubmit={handleUpdate}>
                            <DialogHeader>
                              <DialogTitle>تعديل</DialogTitle>
                              <DialogDescription>
                                إملأ الحقول لتعديل {ele.name}
                              </DialogDescription>
                            </DialogHeader>
                            <Input hidden name="id" defaultValue={ele.id} />
                            <div className="grid gap-4 py-2">
                              <div className="grid gap-3">
                                <Label htmlFor="name">النوع</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  placeholder="ادخل اسم المعالج"
                                  defaultValue={ele.name}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">إلغاء</Button>
                              </DialogClose>
                              <Button type="submit">تعديل</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
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

export default TypesAdministrate;
