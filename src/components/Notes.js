import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from "../context/notes/noteContext"
import Noteitem from './Noteitem';
import AddNote from './AddNote';

function Notes(props) {
    const context = useContext(noteContext);
  const {notes, getNotes, editNote} =  context;
  useEffect(() =>{
    getNotes()
  }, [])

   // useEffect(() =>{
  //   if(!localStorage.getItem('token')){
  //     navigate("/login");
  //   }
  //   else{
  //     getNotes();
  //   }
  
  // }, [navigate, getNotes]);

  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({id:"", etitle:"", edescription:"", etag:""})

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id: currentNote._id, etitle:currentNote.title, edescription:currentNote.description, etag:currentNote.tag})


    // Manually trigger the modal
    var myModal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();

    const modalElement = document.getElementById('exampleModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
      document.querySelector('.modal-backdrop').remove();
    }, { once: true });
  }

  const handleClick = (e) =>{
    editNote(note.id, note.etitle, note.edescription, note.etag)
    refClose.current.click();
    props.showAlert("Updated Successfully", "success");
  }

  const onChange= (e)=>{
    setNote({...note,[e.target.name]: e.target.value})
  }

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <div className='container'>
        <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Launch demo modal
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <form>
  <div className="mb-3 my-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3 my-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" name="edescription" id="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3 my-3">
    <label htmlFor="tag" className="form-label">Tag</label>
    <input type="text" className="form-control" name="etag" id="etag" value={note.etag} onChange={onChange} minLength={5} required/>
  </div>
</form>
              </div>
              <div className="modal-footer">
                <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" disabled={note.etitle.length <5 || note.edescription.length<5} onClick={handleClick} className="btn btn-primary">Update Note</button>
              </div>
            </div>
          </div>
        </div>
    <div className="container">
    <div className="row my-3">
       <h1>You Notes</h1>
       <div className="container mx-2">
       {notes.length ===0 && 'No notes to display'}
       </div>
       {notes.map((note)=>{
        return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note}/>
       })
       }
       </div>
       </div>
       </div>
       </>
  )
}

export default Notes
