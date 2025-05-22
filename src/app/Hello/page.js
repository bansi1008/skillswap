import Link from "next/link";

export default function Page() {
  return (
    <div>
      {" "}
      <h1>Hello Page</h1>
      <p>
        This is the Hello page. You can add your content here. This page is
        located at /hello.
      </p>
      <Link href="/">Go to Home</Link>
    </div>
  );
}
