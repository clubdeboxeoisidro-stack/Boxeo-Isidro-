import React, { useState } from "react";

const users = {
  "admin@isidro.com": { password: "1234", role: "admin" },
  "carlos@isidro.com": { password: "1234", role: "alumno", personal: "3x20 abdominales" },
  "esther@isidro.com": { password: "1234", role: "alumno", personal: "15min saco pesado" },
};

const entrenoComun = "3 rounds de sombra, 5 min comba, 10 flexiones";

const clasesSemana = {
  lunes: ["18:00-19:30", "20:00-21:30"],
  martes: ["18:00-19:30", "20:00-21:30"],
  miercoles: ["18:00-19:30", "20:00-21:30"],
  jueves: ["18:00-19:30", "20:00-21:30"],
  viernes: ["Clases personales (máx 5)"],
};

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState({});

  const login = () => {
    if (users[email] && users[email].password === password) {
      setUser({ email, ...users[email] });
    } else {
      alert("Credenciales inválidas");
    }
  };

  const reservar = (dia, clase) => {
    const clave = dia + "-" + clase;
    setReservas({
      ...reservas,
      [clave]: [...(reservas[clave] || []), user.email],
    });
  };

  const cancelar = (dia, clase, alumno) => {
    const clave = dia + "-" + clase;
    setReservas({
      ...reservas,
      [clave]: (reservas[clave] || []).filter((a) => a !== alumno),
    });
  };

  if (!user) {
    return (
      <div className="card">
        <h2>Login Isidro Boxeo</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Entrar</button>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="card">
        <h2>Panel Administrador</h2>
        <h3>Entrenamiento común</h3>
        <p>{entrenoComun}</p>
        <h3>Calendario semanal</h3>
        {Object.entries(clasesSemana).map(([dia, clases]) => (
          <div key={dia}>
            <h4>{dia}</h4>
            {clases.map((clase) => (
              <div key={clase}>
                <strong>{clase}</strong>
                <ul>
                  {(reservas[dia + "-" + clase] || []).map((alumno) => (
                    <li key={alumno}>
                      {alumno}{" "}
                      <button onClick={() => cancelar(dia, clase, alumno)}>❌</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (user.role === "alumno") {
    return (
      <div className="card">
        <h2>Bienvenido {user.email}</h2>
        <h3>Entrenamiento común</h3>
        <p>{entrenoComun}</p>
        <h3>Entrenamiento personal</h3>
        <p>{user.personal}</p>
        <h3>Reservar clases</h3>
        {Object.entries(clasesSemana).map(([dia, clases]) => (
          <div key={dia}>
            <h4>{dia}</h4>
            {clases.map((clase) => {
              const clave = dia + "-" + clase;
              const inscritos = reservas[clave] || [];
              const maxPax = dia === "viernes" ? 5 : 15;
              const ocupado = inscritos.length >= maxPax;
              const yaInscrito = inscritos.includes(user.email);
              return (
                <div key={clase}>
                  {clase} — {inscritos.length}/{maxPax}
                  <button
                    disabled={ocupado || yaInscrito}
                    onClick={() => reservar(dia, clase)}
                  >
                    {yaInscrito ? "Reservado" : "Reservar"}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
