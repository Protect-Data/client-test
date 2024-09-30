export default function AvatarName({ name }: { name: string }) {
  var names = name.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return (
    <>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-protectdata-500 z-20">
        <span className="text-xs font-medium uppercase leading-none">
          {initials}
        </span>
      </span>
    </>
  );
}
