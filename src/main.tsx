import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";  //Habilita la navegación mediante las direcciones URL
import { AuthProvider } from "./features/auth/AuthProvider";  //Habilita el manejo de la sesión y de los datos del usuario
import './index.css';
import './App.css';
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />      {/*Ruta principal de la aplicación*/}
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>

);
