import React,{useState} from "react";
import NoteContext from "./noteContext";

const NoteState = (props) =>{
  const host = "http://localhost:5000"
    const notesInitial = []
      const [notes, setNotes] = useState(notesInitial)

      // get all notes
      const getNotes = async () =>{
      const response = await fetch(`${host}/api/notes/fetchallnotes`,{
        method: 'GET',
        headers:{
          'Content-Type':'application/json',
          'auth-token' :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZhYmJmZGM0NTU0MjA2OWJmYWFlMDQ3In0sImlhdCI6MTcyMjU5NTgxOX0.tZsHfeQZOirKcdq2tjepDJ7Sn_9n7gEAk6w1VC1YsoE'
        }
      });
      const json = await response.json()
      console.log(json)
      setNotes(json)

    }
      //ADD A NOTE
      const addNote =async(title, description, tag) =>{
        const response = await fetch(`${host}/api/notes/addnote`,{
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
            'auth-token' :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZhYmJmZGM0NTU0MjA2OWJmYWFlMDQ3In0sImlhdCI6MTcyMjU5NTgxOX0.tZsHfeQZOirKcdq2tjepDJ7Sn_9n7gEAk6w1VC1YsoE'
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = response.json();
       const  note = {
          "_id": "66af82bb27d180cfcb2572938",
            "user": "66abbfdc45542069bfaae0475",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2024-08-04T13:31:39.014Z",
            "__v": 0
        };
        setNotes(notes.concat(note))
      }

      //DELETE A NOTE
      const deleteNote =async(id) =>{ 
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
          method: 'DELETE',
          headers:{
            'Content-Type':'application/json',
            'auth-token' :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZhYmJmZGM0NTU0MjA2OWJmYWFlMDQ3In0sImlhdCI6MTcyMjU5NTgxOX0.tZsHfeQZOirKcdq2tjepDJ7Sn_9n7gEAk6w1VC1YsoE'
          }
        });
        const json = response.json();
        console.log(json);
        console.log("deleting with note with id" + id);
        const newNotes = notes.filter((note) =>{return note._id !== id})
        setNotes(newNotes)
      }

      //EDIT A NOTE
      const editNote =async(id, title, description, tag) =>{
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
          method: 'PUT',
          headers:{
            'Content-Type':'application/json',
            'auth-token' :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZhYmJmZGM0NTU0MjA2OWJmYWFlMDQ3In0sImlhdCI6MTcyMjU5NTgxOX0.tZsHfeQZOirKcdq2tjepDJ7Sn_9n7gEAk6w1VC1YsoE'
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = response.json();
       
        let newNotes = JSON.parse(JSON.stringify(notes))
        //Logic to edit the client
        for(let index = 0; index <newNotes.length; index++){
          const element = newNotes[index];
          if(element._id === id){
            newNotes[index].title = title;
            newNotes[index].description=  description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
      }
    return (
    <NoteContext.Provider value={{notes, addNote,deleteNote, editNote, getNotes}}>
         {props.children}
         </NoteContext.Provider>
    )
}

export default NoteState; 