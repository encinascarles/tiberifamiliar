"use client";

import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

export default function UserCarousel({
  members,
}: {
  members:
    | {
        name: string;
        username: string | null;
        id: string;
        image: string | null;
      }[]
    | undefined;
}): JSX.Element {
  return (
    <ScrollArea className="h-[24rem]">
      {members &&
        members.map((member, i) => (
          <Link
            href={`/users/${member.id}`}
            key={i}
            className="flex gap-4 hover:bg-orange-200 px-4 py-2 rounded-md cursor-pointer h-full"
          >
            <Avatar className="cursor-pointer h-14 w-14">
              <AvatarImage
                src={
                  member.image ? member.image : "https://github.com/shadcn.png"
                }
              />
            </Avatar>
            <div className="flex flex-col">
              <p>{member.name}</p>
              <p>{"@" + member.username}</p>
            </div>
          </Link>
        ))}
    </ScrollArea>
  );
}
