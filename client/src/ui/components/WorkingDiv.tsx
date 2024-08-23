import { ChevronDown } from "lucide-react";
import { Button } from "../elements/button";
import { Progress } from "../elements/ui/progress";

const WorkingDiv = ({
  setIsActing,
}: {
  setIsActing: (value: boolean) => void;
}) => (
  <div className="space-y-2 border-4 border-grey-600 shadow-lg rounded-xl p-4">
    <div className="flex items-center justify-between">
      <span>{"Chop wood"}</span>
      <div className="flex items-center">
        <Button variant="outline" size="sm">
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button size="sm" className="ml-2" onClick={() => setIsActing(false)}>
          Harvest
        </Button>
      </div>
    </div>
    <div className="flex items-center">
      <Progress value={50} />
    </div>
    <div className="flex flex-col items-center border-4 border-grey-600 shadow-lg rounded-xl p-4">
      <span className="">{"Clamable:"}</span>

      <span>{"100 wood"}</span>
      <span>{"100 xp"}</span>
    </div>
  </div>
);

export default WorkingDiv;
