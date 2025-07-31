import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import supabase from "./lib/supabase";
import Main from "./pages/Main";
import Login from "./pages/Login";
import TypesAdministrate from "./pages/TypesAdministrate";
import WorksAdministrate from "./pages/WorksAdministrate";
import Container from "./components/Container";
import Loader from "./components/loader";
import ServicesAdministrate from "./pages/ServicesAdministrate";
import CpusAdministrate from "./pages/CpusAdministrate";
import PasswordAdministrate from "./pages/PasswordAdministrate";

const App = () => {
  const [session, setSession] = useState<Session | null>();
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoad(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoad(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (load) return <Loader />;

  return (
    <Container>
      <Routes>
        <Route
          index
          path="/"
          element={session ? <Main /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/types"
          element={session ? <TypesAdministrate /> : <Navigate to="/login" />}
        />
        <Route
          path="/works"
          element={session ? <WorksAdministrate /> : <Navigate to="/login" />}
        />
        <Route
          path="/service/:id"
          element={
            session ? <ServicesAdministrate /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/cpus"
          element={session ? <CpusAdministrate /> : <Navigate to="/login" />}
        />
        <Route
          path="/passwords"
          element={
            session ? <PasswordAdministrate /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
