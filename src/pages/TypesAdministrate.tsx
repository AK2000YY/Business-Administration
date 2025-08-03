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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { DeviceType } from "@/types/device_type";
import { Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const typeSelectorArray = ["cpus", "device_types"] as const;
type TypeSelector = "cpus" | "device_types";

const TypesAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [load, setLoading] = useState<boolean>(true);
  const [types, setTypes] = useState<any[]>([]);
  const [typeSelector, setTypeSelector] =
    useState<TypeSelector>("device_types");

  useEffect(() => {
    const getTypes = async () => {
      const { data, error } = await supabase.from(typeSelector).select("*");
      console.log(data);
      if (error) toast.error("حدث خطأ ما!");
      else setTypes(data ?? []);
      setLoading(false);
    };

    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: typeSelector },
        ({ eventType, old, new: newData }) => {
          console.log(eventType);
          switch (eventType) {
            case "INSERT": {
              const data = newData;
              setTypes((prev: any) => [...prev, data]);
              break;
            }
            case "UPDATE": {
              const data = newData;
              setTypes((prev) =>
                prev.map((ele: any) => (ele.id === data.id ? data : ele))
              );
              break;
            }
            case "DELETE": {
              const data = old;
              setTypes((prev) => prev.filter((ele) => ele.id !== data.id));
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
  }, [typeSelector]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let val;
    if (typeSelector == "device_types")
      val = formData.get("type")?.toString() ?? "";
    else val = formData.get("name")?.toString() ?? "";
    if (val == "") toast.error("أحد الحقول فارغة!");
    else {
      const { error } = await supabase
        .from(typeSelector)
        .insert([
          typeSelector == "device_types" ? { type: val } : { name: val },
        ]);
      if (error) toast.error("شيء ما خاطىء!");
      else toast.success("تمت الإضافة");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get("id")?.toString() ?? "";
    let val;
    if (typeSelector == "device_types")
      val = formData.get("type")?.toString() ?? "";
    else val = formData.get("name")?.toString() ?? "";
    if (val == "") toast.error("أحد الحقول فارغة!");
    else {
      const { error } = await supabase
        .from(typeSelector)
        .update(typeSelector == "device_types" ? { type: val } : { name: val })
        .eq("id", id);
      if (error) toast.error("شيء ما خاطىء!");
      else toast.success("تم حفظ التعديلات");
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("device_types")
      .select("*")
      .textSearch("type", search);
    setTypes(data ?? []);
    console.log("ak2", data);
    if (error) toast.error("شيء ما خاطىء!");
    else toast.success(`تم العثور على ${data.length} عنصر`);
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen">
      <Nav>
        <form className="flex gap-x-1 pr-35" onSubmit={handleSearch}>
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

        <div className="flex gap-x-2">
          <Select
            onValueChange={(value: TypeSelector) => setTypeSelector(value)}
            value={typeSelector}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>اختر</SelectLabel>
                {typeSelectorArray.map((ele) => (
                  <SelectItem key={ele} value={ele}>
                    {ele == "cpus" ? "المعالجات" : "أنواع الأجهزة"}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#165D4E]">
                إضافة نوع جديد <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAdd}>
                <DialogHeader>
                  <DialogTitle>إضافة نوع جديد</DialogTitle>
                  <DialogDescription>
                    إملأ الحقول المطلوبة لإضافة نوع جديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">النوع</Label>
                    <Input
                      id="type"
                      name={typeSelector == "cpus" ? "name" : "type"}
                      placeholder={`ادخل ${
                        typeSelector == "cpus" ? "الاسم" : "النوع"
                      }`}
                    />
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
        </div>
      </Nav>
      <div className="p-3">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح قائمة الأنواع</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">
                  {typeSelector == "cpus" ? "الاسم" : "النوع"}
                </TableHead>
                <TableHead className="w-1/3">تاريخ الإضافة</TableHead>
                <TableHead className="w-1/3">حذف أو تعديل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((ele) => (
                <TableRow key={ele.id}>
                  <TableCell className="w-1/4">
                    {typeSelector == "cpus" ? ele.name : ele.type}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {new Date(ele.created_at).toLocaleString("ar-EG")}
                  </TableCell>
                  <TableCell className="w-1/4">
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
                                إملأ الحقول لتعديل {ele.type}
                              </DialogDescription>
                            </DialogHeader>
                            <Input hidden name="id" defaultValue={ele.id} />
                            <div className="grid gap-4 py-2">
                              <div className="grid gap-3">
                                <Label htmlFor="type">النوع</Label>
                                <Input
                                  id="type"
                                  name={
                                    typeSelector == "cpus" ? "name" : "type"
                                  }
                                  placeholder={`ادخل ${
                                    typeSelector == "cpus" ? "الاسم" : "النوع"
                                  }`}
                                  defaultValue={
                                    typeSelector == "cpus" ? ele.name : ele.type
                                  }
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
