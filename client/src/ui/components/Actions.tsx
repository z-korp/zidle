import { ChevronDown } from "lucide-react";
import { Button } from "../elements/button";

const Actions = ({
  setIsActing,
}: {
  setIsActing: (value: boolean) => void;
}) => (
  <div className="space-y-2">
    {["Cut Wood", "Mine rock"].map((action) => (
      <div key={action} className="flex items-center justify-between">
        <span>{action}</span>
        <div className="flex items-center">
          <Button variant="outline" size="sm">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="sm" className="ml-2" onClick={() => setIsActing(true)}>
            Go
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export default Actions;
