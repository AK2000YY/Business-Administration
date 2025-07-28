import { useParams } from "react-router-dom";

const ServicesAdministrate = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default ServicesAdministrate;
