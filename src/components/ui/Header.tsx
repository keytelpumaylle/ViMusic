import { Dot } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between p-4 border-[#eaeaea] border-b-[2px]">
        <div className="font-bold">ViMusic</div>
        <div className="flex items-center gap-8">
            <Link href="/" className="flex gap-1 items-center "><span className="animate-ping"><Dot color="#35EF00" strokeWidth={5}/></span>Online</Link>
            <Link href="/local" className="flex gap-1 items-center"><span className="animate-ping"><Dot color="#D20100" strokeWidth={5}/></span>Offline</Link>
        </div>
    </div>
  );
}