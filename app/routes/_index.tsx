import { type MetaFunction } from "@remix-run/node";
import { Add } from "~/component/Add";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="p-2">
      add(a, b): <Add />
    </div>
  );
}
