import { useParams } from "react-router-dom";

export { PatientRequest };

function PatientRequest() {
  const { id } = useParams();

  return <h1>{id}</h1>;
}
