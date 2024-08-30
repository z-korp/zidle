import { useCallback } from "react";
import { Separator } from "@/ui/elements/separator";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export const Header = () => {
  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });

  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("", { replace: true });
  }, [navigate]);

  return isMdOrLarger ? (
    <div>
      <div className="flex justify-center items-center p-4 flex-wrap md:justify-between">
        <div
          className="cursor-pointer flex gap-8 items-center"
          onClick={handleClick}
        >
          <p className="text-4xl font-bold text-slate-700">zIdle</p>
          {/* <Leaderboard /> */}
        </div>
        <div className="flex flex-col gap-4 items-center md:flex-row">
          {/* {ACCOUNT_CONNECTOR === "controller" && <Connect />} */}
          <div className="flex gap-4">
            {/* <SettingsDropDown /> */}
            {/*<ModeToggle />*/}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      {/* <MobileMenu /> */}
      <Separator />
    </div>
  );
};
