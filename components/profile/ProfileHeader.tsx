import Image from "next/image";
import { ShieldCheck, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/shared/ShareButton";
import { getInitials } from "@/lib/utils";
import type { User } from "@prisma/client";

interface ProfileHeaderProps {
  user: User & { _count: { followers: number; following: number } };
  isOwnProfile?: boolean;
  isFollowing?: boolean;
}

export function ProfileHeader({ user, isOwnProfile, isFollowing }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-32 md:h-48 rounded-xl bg-gradient-to-r from-[#DC143C]/20 via-[#1E1E1E] to-[#141414] border border-[#2A2A2A]" />

      <div className="px-4 md:px-6 pb-4">
        {/* Avatar */}
        <div className="relative -mt-12 mb-4 inline-block">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden ring-4 ring-[#0A0A0A] bg-[#1E1E1E]">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                width={96}
                height={96}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[#DC143C]/20 text-[#DC143C] text-2xl font-black">
                {getInitials(user.displayName)}
              </div>
            )}
          </div>
          {user.isVerified && (
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-[#0A0A0A]">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`text-xl md:text-2xl font-black ${user.isPremium ? "text-[#FFD700]" : "text-white"}`}>
                {user.displayName}
              </h1>
              {user.isPremium && <Badge variant="premium">PRO</Badge>}
              {user.isVerified && <Badge variant="verified">Verified</Badge>}
            </div>
            <p className="text-[#A0A0A0] text-sm">@{user.username}</p>
            {(user.city || user.province) && (
              <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-1">
                <MapPin className="h-3 w-3" />
                <span>
                  {[user.city, user.province].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {user.bio && (
              <p className="text-sm text-[#A0A0A0] mt-2 max-w-lg">{user.bio}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL}/user/${user.username}`}
              title={`${user.displayName} on Nepal Ranks`}
            />
            {isOwnProfile ? (
              <a href="/profile/edit">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </a>
            ) : (
              <form action={`/api/follow`} method="POST">
                <input type="hidden" name="targetUserId" value={user.id} />
                <Button variant={isFollowing ? "outline" : "default"} size="sm">
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-[#2A2A2A]">
          <div className="text-center">
            <div className="text-lg font-black text-white">{user._count.followers}</div>
            <div className="text-xs text-[#6B7280]">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-white">{user._count.following}</div>
            <div className="text-xs text-[#6B7280]">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}
