export default function AvatarName({
  name,
  isAdmin,
  disabled
}: {
  name: string;
  isAdmin?: boolean;
  disabled?: boolean;
}) {
  var names = name.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return (
    <>
      <span
        title={name}
        className={`inline-flex select-none h-6 w-6 items-center justify-center rounded-full ${
          disabled ? `cursor-not-allowed opacity-80` : ``
        } ${isAdmin ? `bg-protectdata-500` : `bg-zinc-700 text-white`} z-20`}
      >
        <span className="text-xs font-medium uppercase leading-none">
          {initials}
        </span>
      </span>
    </>
  );
}
