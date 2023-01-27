import { useState, useEffect } from "react";
import "./App.css";
import { firebase } from "./firebase";
function App() {
  const [listUser, setListUser] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [id, setId] = useState("");
  const [moodEdit, setMoodEdit] = useState(false);
  const database = firebase.firestore();
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await database.collection("usuarios").get();
        const arrayData = data.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setListUser(arrayData);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const saveData = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("Ingrese un nombre");
      return;
    }
    if (!apellido.trim()) {
      alert("Ingrese un apellido");
      return;
    }

    try {
      const newUser = {
        nombre,
        apellido,
      };

      const data = await database.collection("usuarios").add(newUser);
      setListUser([
        ...listUser,
        {
          id: data.id,
          ...newUser,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setApellido("")
    setNombre("")
  };

  const deleteData = async (id)=> {
    try {
      await database.collection("usuarios").doc(id).delete()

    const filterData = listUser.filter((user)=> user.id!==id)
    setListUser(filterData)
    } catch (error) {
      console.log(error)
    }

  }

  const modoEditing = (user)=> {
    setNombre(user.nombre)
    setApellido(user.apellido)
    setId(user.id)
    setMoodEdit(true)
  }

  const editingData = async (e)=> {
    e.preventDefault()

    if (!nombre.trim()) {
      alert("Ingrese un nombre");
      return;
    }
    if (!apellido.trim()) {
      alert("Ingrese un apellido");
      return;
    }
    try {
      await database.collection("usuarios").doc(id).update({
        nombre,apellido
      })

      const updateList = listUser.map((user)=> user.id === id ? {
        id: id,
        nombre,
        apellido
      }: user) 
      setListUser(updateList)

      setNombre("")
      setApellido("")
      setId("")
      setMoodEdit(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <form onSubmit={moodEdit ? editingData : saveData}>
        <div>
          <h2 className="text-center">{moodEdit ? "Editar usuario" : "Formulario de registro"}</h2>
        </div>
        <input
          type="text"
          placeholder="Ingrese nombre"
          className="form-control my-2"
          onChange={(e) => setNombre(e.target.value)}
          value={nombre}
        />
        <input
          type="text"
          placeholder="Ingrese apellido"
          className="form-control my-2"
          onChange={(e) => setApellido(e.target.value)}
          value={apellido}
        />
        <div className="d-grid gap-2 my-2">
          {
            moodEdit ? <button className="btn btn-warning">Editar</button> :
            <button className="btn btn-success">Registrar</button>
          }
          
        </div>
      </form>
      <div className="render-list my-4">
        <div>
          <h2 className="text-center my-4">Lista de usuarios registrados</h2>
        </div>
        <ul className="my-3">
          {listUser.map((user) => (
            <li key={user.id}>
              {user.nombre} - {user.apellido}
              <button className="btn btn-danger mx-2" onClick={()=> deleteData(user.id)}>Delete</button>
              <button className="btn btn-warning" onClick={()=> modoEditing(user)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
