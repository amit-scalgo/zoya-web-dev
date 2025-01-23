import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CallRecordListing from "@/components/admin/records/calls/Index";
import ChatRecordListing from "@/components/admin/records/chats/Index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useSearchParams } from "react-router-dom";

export default function RecordListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/admin">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-zoyaprimary">
                Logs
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Tabs defaultValue="chats" className="w-full">
        <TabsList>
          <TabsTrigger
            onClick={() => {
              setSearchParams("");
            }}
            value="chats"
          >
            Chats
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setSearchParams("");
            }}
            value="calls"
          >
            Call Logs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chats">
          <ChatRecordListing />
        </TabsContent>
        <TabsContent value="calls">
          <CallRecordListing />
        </TabsContent>
      </Tabs>
    </>
  );
}
