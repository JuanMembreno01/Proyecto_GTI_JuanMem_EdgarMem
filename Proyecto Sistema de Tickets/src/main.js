import React, { useState } from "react";
import "./main.css";
import Swal from 'sweetalert2';

const Main = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const AuthorizationHeader = '3c96d6117865dae9d77dbb517c3972907e6d245c'; // Clave API de Redmine

  const envioPeticion_Reporte = async (e) => {
    e.preventDefault();
    if (subject.length === 0 || description.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'No se ingresó ningún reporte. Vuelva a intentar.',
      });
    } else {
      try {
        const response = await fetch('/issues.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Redmine-API-Key': AuthorizationHeader
          },
          body: JSON.stringify({
            issue: {
              project_id: 'projecttickets',
              subject: subject,
              description: description,
              tracker_id: 1, // Errores
              status_id: 1,  // Nueva
              priority_id: 4 // Urgente
            }
          })
        });

        const data = await response.json();
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Creación Exitosa',
            text: "Se creó un reporte sobre el problema exitosamente. ID: " + data.issue.id
          }).then(() => {
            setSubject("");
            setDescription("");
          });
        } else {
          console.error('Error en la respuesta:', data);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al crear el reporte. ' + (data.errors ? data.errors.join(', ') : '')
          });
        }
      } catch (error) {
        console.error('Error al crear el issue:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al enviar la petición.'
        });
      }
    }
  }

  return (
    <div className="principal">
      <div className="cajaCentral">
        <h1 className="text">Reportar problema</h1>
        <form onSubmit={envioPeticion_Reporte}>
          <div className="inputContainer">
            <input
              type="text"
              className="entradaPeticion"
              placeholder="Ingrese el asunto"
              onChange={(event) => setSubject(event.target.value)}
              value={subject}
            />
          </div>
          <div className="inputContainer">
            <textarea
              className="entradaPeticion"
              placeholder="Ingrese reporte sobre problema"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </div>
          <button className="Sendbt" type="submit">Enviar</button>
        </form>
      </div>
    </div>
  )
}

export default Main;
