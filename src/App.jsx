import { useState, useEffect } from "react";
import "./App.css";
import {firebase} from './firebase'

function App() {
    const db = firebase.firestore()

    //hooks
    const [listUser, setListUser] = useState([])
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [id, setId] = useState("")
    const [moodEdit, setMoodEdit] = useState(false)

  useEffect(() => {
    const getData = async ()=> {
       try {
        const data = await db.collection("usuarios").get()
        const arrayData = data.docs.map((document)=> ({
          id: document.id,
          ...document.data()
        }))
        setListUser(arrayData)
       } catch (error) {
        console.log(error)
       }
    }

      getData()
  }, [])
  

  const saveData = async (e)=> {
    e.preventDefault()
    if (!nombre.trim()) {
      alert("Ingrese nombre")
      return 
    }
    if (!apellido.trim()) {
      alert("Ingrese apellido")
      return 
    }

    try {

      const newUser = {
        nombre,
        apellido
      }
      const data = await db.collection("usuarios").add(newUser)
      setListUser([
        ...listUser,
        {
          id: data.id,
          ...newUser
        }
      ])
    } catch (error) {
      console.log(error)
    }

    setNombre("")
    setApellido("")
  }


  const deleteData = async (id)=> {
      try {

        await db.collection("usuarios").doc(id).delete()
        const filterListUser = listUser.filter((user)=> user.id!==id)
        setListUser(filterListUser)
      } catch (error) {
        console.log(error)
      }
  }

    const ismodeEdit=({nombre, apellido, id})=> {
      setNombre(nombre)
      setApellido(apellido)
      setId(id)
      setMoodEdit(true)

    }

    const editData = async (e)=> {
      e.preventDefault()
      if (!nombre.trim()) {
        alert("Ingrese nombre")
        return 
      }
      if (!apellido.trim()) {
        alert("Ingrese apellido")
        return 
      }

      try {
        const data = await db.collection("usuarios").doc(id).update({nombre,apellido})

        const isEditedList = listUser.map((user)=>user.id === id ? {id, nombre,apellido} : user)

        setListUser(isEditedList)

        setApellido("")
        setNombre("")
        setId("")
        setMoodEdit(false)
      } catch (error) {
        console.log(error)
      }

    }
  return (
    <div className="container ">
      <form onSubmit={moodEdit ? editData : saveData}>
          <div>
            <h2>{moodEdit ? "Editar Usuario": "Registro de usuarios"}</h2>
          </div>

            <input type="text" className="form-control my-2" onChange={(e)=> setNombre(e.target.value)} value={nombre} placeholder="Ingrese nombre"/>
            <input type="text" className="form-control  my-2" onChange={(e)=> setApellido(e.target.value)} value={apellido} placeholder="Ingrese apellido"/>
            <div className="d-grid gap-2  my-2">
            {
              moodEdit ? <button className="btn btn-warning">Editar</button> : <button className="btn btn-success">Registar</button>
            }
            </div>
      </form>
      <section className="my-2">
            <div className="my-2"><h2>Lista de usuarios</h2></div>
            <ul>
              {
                listUser.map((user)=> (
                  <li key={user.id}>
                    {user.nombre} - {user.apellido}
                    <button className="btn btn-danger mx-2" onClick={()=> deleteData(user.id)}>Eliminar</button>
                    <button className="btn btn-warning mx-2" onClick={()=> ismodeEdit(user)}>Editar</button>
                  </li>
                ))
              }
            </ul>
      </section>
    </div>
  );
}

export default App;
