import DeleteOrEdit from "@/components/DeleteOrEdit";
import FromServiceAdd from "@/components/FormServiceAdd";
import FormServiceEdit from "@/components/FormServiceEdit";
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
import type { Service } from "@/types/service";
import { Download, Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ServicesAdministrate = () => {
  const { id } = useParams();

  const [search, setSearch] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [end, setEnd] = useState<number>(14);

  useEffect(() => {
    const getServices = async () => {
      setLoad(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("job_id", id)
        .range(end - 14, end);
      console.log(data);
      if (error) toast.error("حدث خطأ ما!");
      else {
        setServices(data ?? []);
        setLoad(false);
      }
    };

    const services = supabase
      .channel("services-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        async ({ eventType, old, new: newData }) => {
          console.log("hiii");
          switch (eventType) {
            case "INSERT": {
              const { data } = await supabase
                .from("services")
                .select("*")
                .eq("job_id", id)
                .eq("id", newData.id)
                .single();
              setServices((prev) => {
                if (data && prev.length < 15) return [...prev, data];
                else return prev;
              });
              break;
            }
            case "UPDATE": {
              const { data } = await supabase
                .from("services")
                .select("*")
                .eq("job_id", id)
                .eq("id", newData.id)
                .single();
              console.log(data);
              if (data) {
                setServices((prev) =>
                  prev.map((service) =>
                    service.id === data.id ? data : service
                  )
                );
              }
              break;
            }
            case "DELETE": {
              const service: Service = old as Service;
              setServices((prev) => prev.filter((ele) => ele.id != service.id));
            }
          }
        }
      )
      .subscribe();

    getServices();
    return () => {
      services.unsubscribe();
    };
  }, [end]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //database insert
    const formData = new FormData(form);
    let data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
      if (!data[key]) {
        toast.error("أحد الحقول فارغة!");
        return;
      }
    }

    //file  uploade
    const fileInput = form.elements.namedItem("attach") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    let filePath: string | null = null;

    if (file) {
      filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);

      if (uploadError) {
        toast.error("فشل في رفع المرفق!");
        return;
      }
    }

    if (!filePath) {
      data["attach"] = null;
    } else {
      data["attach"] = filePath;
    }

    data["job_id"] = id;

    const { error } = await supabase.from("services").insert([data]);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تمت الإضافة");
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    service: Service
  ) => {
    e.preventDefault();

    //file  uploade
    const form = e.currentTarget as HTMLFormElement;

    //database insert
    const formData = new FormData(form);
    let data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
      if (!data[key]) {
        toast.error("أحد الحقول فارغة!");
        return;
      }
    }

    const fileInput = form.elements.namedItem("attach") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    let filePath: string | null = null;

    if (service.attach && file) {
      console.log("done");
      const { error } = await supabase.storage
        .from("attachments")
        .remove([service.attach]);
      if (error) {
        console.log("error", error);
        return;
      }
    }

    if (file) {
      filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        toast.error("فشل في رفع المرفق!");
        return;
      }
    }

    if (!filePath) {
      data["attach"] = null;
    } else {
      data["attach"] = filePath;
    }

    data["job_id"] = id;

    const { error } = await supabase
      .from("services")
      .update([data])
      .eq("id", data["id"]);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تم التعديل");
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .textSearch("tsv", search.trim().split(/\s+/).join(" & "));
    setServices(data ?? []);
    console.log("ak2", data);
    if (error) toast.error("شيء ما خاطىء!");
  };

  const handleDownload = async (attachment: string) => {
    const { data } = supabase.storage
      .from("attachments")
      .getPublicUrl(attachment);

    const publicUrl = data.publicUrl;

    window.open(publicUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-screen">
      <Nav>
        <form className="flex gap-x-1 pr-12" onSubmit={handleSearch}>
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
              إضافة تخديم <Plus />
            </Button>
          </DialogTrigger>
          <FromServiceAdd onAdd={handleAdd} />
        </Dialog>
      </Nav>
      <div className="flex-1 overflow-y-auto relative">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح قائمة الخدمات الخاصة بالجهاز</TableCaption>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-1/6">الحالة</TableHead>
                <TableHead className="w-1/6">نوع التخديم</TableHead>
                <TableHead className="w-1/6">المتطلبات</TableHead>
                <TableHead className="w-1/6">الملاحظات</TableHead>
                <TableHead className="w-1/6">المرفق</TableHead>
                <TableHead className="w-1/6">حذف تعديل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((ele) => (
                <TableRow key={ele.id} className="bg-[#988561]/30">
                  <TableCell className="w-1/6">{ele.status}</TableCell>
                  <TableCell className="w-1/6">{ele.service_type}</TableCell>
                  <TableCell className="w-1/6">
                    {ele.requirements ?? ""}
                  </TableCell>
                  <TableCell className="w-1/6">{ele.notes ?? ""}</TableCell>
                  <TableCell className="w-1/6">
                    {ele.attach ? (
                      <Download
                        className="m-auto cursor-pointer"
                        onClick={() => handleDownload(ele.attach!)}
                      />
                    ) : (
                      "لايوجد مرفق"
                    )}
                  </TableCell>
                  <TableCell className="w-1/6">
                    <DeleteOrEdit ele={ele}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="size-min bg-[#165D4E]">
                            <Pencil />
                          </Button>
                        </DialogTrigger>
                        <FormServiceEdit
                          service={ele}
                          onUpdate={(e) => handleUpdate(e, ele)}
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

export default ServicesAdministrate;
