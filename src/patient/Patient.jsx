import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { patientsActions } from "_store";

export { Patient };

function Patient() {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { patients } = useSelector((x) => x.patients);

  useEffect(() => {
    dispatch(patientsActions.getAll());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Hi {authUser?.first_name}!</h1>
      <h3>Users from secure api end point:</h3>
      {patients.length && (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              {patient.first_name} - {patient.gender}
            </li>
          ))}
        </ul>
      )}
      {patients.loading && (
        <div className="spinner-border spinner-border-sm"></div>
      )}
      {patients.error && (
        <div className="text-danger">
          Error loading users: {patients.error.message}
        </div>
      )}
    </div>
  );
}
