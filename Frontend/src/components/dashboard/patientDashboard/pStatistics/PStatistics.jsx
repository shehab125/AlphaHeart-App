import useDataCall from "../../../../hooks/useDataCall";
import AccordingToBranch from "./AccordingToBranch";
import CancelStats from "./CancelStats";
import { useEffect } from "react";
import NumberOfAppointments from "./NumberOfAppointments";
import MessageStats from "./MessageStats";
import UserStats from "./UserStats";

const PStatistics = () => {
  const { getData } = useDataCall();

  useEffect(() => {
    getData("doctors");
  }, [getData]);

  return (
    <div className="p-6">
      <div className="p-statistic flex flex-wrap gap-6 justify-center">
        <div className="p-statistic-left flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-[410px]">
            <AccordingToBranch/>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-[410px]">
            <CancelStats/>
          </div>
        </div>
        <div className="p-statistic-right flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-[410px]">
              <NumberOfAppointments/>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-[410px]">
              <MessageStats/>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full h-[410px]">
            <UserStats/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PStatistics;
