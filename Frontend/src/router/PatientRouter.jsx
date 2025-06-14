import Pharmacies from "../pages/patient/Pharmacies";
import Hospitals from "../pages/patient/Hospitals";

const PatientRouter = () => {
  return (
    <Routes>
      <Route path="/pharmacies" element={<Pharmacies />} />
      <Route path="/hospitals" element={<Hospitals />} />
    </Routes>
  );
};

export default PatientRouter; 