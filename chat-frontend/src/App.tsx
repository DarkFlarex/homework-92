import AppToolbar from "./UI/AppToolbar/AppToolbar";
import {Container, Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./UI/ProtectedRoute/ProtectedRoute";
import {useAppSelector} from "./app/hooks";
import {selectUser} from "./features/users/usersSlice";
import Register from "./features/users/Register";
import Login from "./features/users/login";
import Messages from "./features/messages/Messages";


function App() {
    const user = useAppSelector(selectUser);
  return (
      <>
        <header>
          <AppToolbar/>
        </header>
          <Container maxWidth="xl" component="main">
              <Routes>
                  <Route path="/register" element={<Register/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route
                      path="/"
                      element={
                          <ProtectedRoute isAllowed={!!user}>
                              <Messages/>
                          </ProtectedRoute>
                      }
                  />

                  <Route path="*" element={<Typography variant="h1">Not found</Typography>} />
              </Routes>
          </Container>
      </>
  )
}

export default App