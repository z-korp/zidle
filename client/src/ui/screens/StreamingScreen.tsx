import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/ui/containers/Header";

/**
 * StreamingScreen component - Displays streaming content and options
 */
export const StreamingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl">
          <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
            <CardContent className="p-4">
              {/* Header with navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold">Streaming</h1>
                <div className="w-8" /> {/* Spacer for alignment */}
              </div>

              {/* Streaming Content */}
              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded">
                  <h2 className="text-lg font-semibold mb-2">Live Stream</h2>
                  <p className="text-gray-300">
                    Streaming content will be displayed here...
                  </p>
                </div>

                {/* Controls or additional content */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    Option 1
                  </Button>
                  <Button variant="outline" className="w-full">
                    Option 2
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
