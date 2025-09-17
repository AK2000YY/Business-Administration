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
import PasswordAdministrate from "./pages/PasswordAdministrate";
import { userIsAdmin } from "./permisson/user";
import UsersAdministarte from "./pages/UsersAdministarte";

const App = () => {
  const [session, setSession] = useState<Session | null>();
  const [load, setLoad] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
    async function getUserRole() {
      const isAdmin = await userIsAdmin();
      setIsAdmin(isAdmin);
    }
    getUserRole();
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
          element={
            isAdmin ? (
              <TypesAdministrate />
            ) : session ? (
              <Main />
            ) : (
              <Navigate to="/login" />
            )
          }
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
          path="/passwords"
          element={
            isAdmin ? (
              <PasswordAdministrate />
            ) : session ? (
              <Main />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAdmin ? (
              <UsersAdministarte />
            ) : session ? (
              <Main />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
