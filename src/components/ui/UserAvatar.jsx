export default function UserAvatar({ user, className = "h-10 w-10" }) {
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`${className} shrink-0 rounded-xl object-cover shadow-md ring-2 ring-white`}
      />
    )
  }

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-dost-500 to-dost-600 text-sm font-bold text-white shadow-md shadow-dost-500/20`}
    >
      {user?.initials || "TF"}
    </div>
  )
}
