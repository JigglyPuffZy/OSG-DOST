import { PROFILE_AVATAR_URL } from "../../utils/settings"

export default function UserAvatar({ user, className = "h-10 w-10" }) {
  const avatarUrl = user?.avatarUrl || PROFILE_AVATAR_URL
  const label = user?.displayName || "Profile"

  return (
    <img
      src={avatarUrl}
      alt={label}
      className={`${className} shrink-0 rounded-xl object-cover object-top shadow-md ring-2 ring-white`}
    />
  )
}
