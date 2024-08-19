import { type MetaFunction } from "@remix-run/node";
import { Add } from "~/component/Add";
import { Bench } from "~/component/Bench";
import { Editor } from "~/component/Editor";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <div className="pt-2 pl-2">
        <Add />
      </div>
      <div className="pt-2 pl-2">
        <Editor />
      </div>
      <div className="pt-2 pl-2">
        <Bench />
      </div>
    </>
  );
}
