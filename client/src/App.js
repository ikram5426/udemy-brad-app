import { Fragment } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/utils/Alert'

const App = () => (
  <Fragment>
    <Navbar />
    <Alert/>
    <Routes>
      <Route exact path='/' element={<LandingPage />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/register' element={<Register />} />
    </Routes>
  </Fragment>
);

export default App;
