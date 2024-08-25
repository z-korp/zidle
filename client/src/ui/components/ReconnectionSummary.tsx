import React from "react";
import { Button } from "../elements/button";

interface ReconnectionSummaryProps {
  data: {
    timePassed: string;
    resourcesGained: Array<{ name: string; quantity: number }>;
  };
  onContinue: () => void;
}

const ReconnectionSummary: React.FC<ReconnectionSummaryProps> = ({ data, onContinue }) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg fixed inset-0 flex items-center justify-center z-50">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
        <p className="mb-2">You were away for: {data.timePassed}</p>
        <h3 className="text-xl font-semibold mb-2">Resources gained:</h3>
        <ul className="mb-4">
          {data.resourcesGained.map((resource, index) => (
            <li key={index}>
              {resource.name}: {resource.quantity}
            </li>
          ))}
        </ul>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default ReconnectionSummary;