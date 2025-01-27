import React from "react";

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <h3 className="font-medium text-sm">AI Settings</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Temperature</label>
            <input type="range" min="0" max="100" className="w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Response Length</label>
            <select className="bg-gray-700 rounded-md p-2 text-sm">
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="memory" className="rounded" />
            <label htmlFor="memory" className="text-sm text-gray-300">
              Enable Memory
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
