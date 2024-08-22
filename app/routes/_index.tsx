import { Add, AddInt } from "~/component/Add";
import { Bench } from "~/component/Bench";
import { Editor } from "~/component/Editor";

export default function Index() {
  return (
    <>
      <div className="pt-2 pl-2">
        <Add />
      </div>
      <div className="pt-2 pl-2">
        <AddInt />
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
