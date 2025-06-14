import React, { useState, useEffect, useRef } from "react";
import "./pNote.css";
import send from "../../../../assets/send.png";
import trash from "../../../../assets/trash.png";
import click from "../../../../assets/click.png";
import { useSelector } from "react-redux";
import useDataCall from "../../../../hooks/useDataCall";

const PNote = () => {
  const { getSingleData, delData, postData, putData } = useDataCall();
  const { notes } = useSelector((state) => state.data);
  const { userId } = useSelector((state) => state.auth);

  const inputRef = useRef(null); // useRef kullanarak input alanını referanslayın
  const [newNote, setNewNote] = useState(""); // Yeni Note girişi için state
  const [completedNotes, setCompletedNotes] = useState([]);


  const handleDeleteNote = (id) => {
    delData("notes", id);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newNote) {
      const newNoteData = {
        userId: userId,
        note: newNote,
      };
      postData("notes", newNoteData);
      setNewNote("");
    }
  };

  const handleNoteClick = (note) => {
    putData("notes", note.id, { ...note, isCompleted: !note.isCompleted });
    getSingleData("notes", userId);
    window.location.reload();
  };

  const isNoteCompleted = (noteId) => completedNotes.includes(noteId);

  const handleChange = () => {
    // Her karakter girişinde setState yerine input değerini güncelleyin
    setNewNote(inputRef.current.value);
  };

  return (
    <div className="note-main container flex justify-center ml-4 h-[825px] bg-white  ">
      <div>
        <div className=" text-main-dark-blue py-4">
          <h3 className="text-3xl font-bold mx-4">My Notes</h3>
        </div>
        <div className="form-main p-2 flex flex-col justify-center w-[650px] ">
          <div className="task-form flex flex-col border-2 rounded-lg border-main-light-blue2 py-10 mb-[15px] ">
            <form action="" id="p-noteForm" onSubmit={handleSubmit}>
              <input
                ref={inputRef} // Referansı input elementine atayın
                type="text"
                className=" bg-transparent w-[630px] text-main-dark-blue mr-2 py-5 px-2 leading-tight focus:outline-none"
                placeholder="Add note"
                value={newNote}
                onChange={handleChange} // Değişikliklerde handleChange'i çağırın
              />

              <button
                type="submit"
                className="flex-shrink-0 flex w-full justify-center items-center gap-3 mt-6 mb-[-40px] h-[50px] bg-main-light-blue2 hover:bg-main-light-blue2 border-main-light-blue2 hover:border-main-light-blue2 text-[20px] font-normal border-4 text-main-dark-blue  rounded"
              >
                {" "}
                <img src={send} alt="send" />
                Add note
              </button>
            </form>
          </div>

          <div className=" note-main-add ">
            {notes?.map((note, index) => (
              <div
                key={index}
                className="task-add flex mb-4 align-content-center justify-center border-2 w-[630px]  bg-main-light-blue  hover:bg-[white] hover:text-white rounded-lg border-main-light-blue2 cursor-pointer "
              >
                <span className={`font-medium flex-1 text-2xl text-main-dark-blue border-1 border-main-light-blue2 rounded-md p-3 px-4 bg-main-light-blue2 mr-3 w-full ${note.isCompleted || isNoteCompleted(note.id)
                    ? "bg-[#B7D8F8] text-gray-50"
                    : ""
                  }`} >
                  {index + 1}.
                </span>{" "}
                <div className="my-auto"> 
                  <button
                    className={`text-main-dark-blue w-[520px] flex justify-between my-auto ${note.isCompleted || isNoteCompleted(note.id)
                        ? "line-through"
                        : ""
                      }`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="task-box flex justify-between w-[600px] ">
                      <p className="task-text w-[500px] text-left">{note.note}</p>
                      <img src={click} alt="click" className="w-6 h-6 my-auto"/>
                    </div>
                  </button>
                </div> 
                <button
                  className="flex-shrink-0 flex-2 border-transparent border-4 text-sm py-1 px-2 rounded"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <img src={trash} alt="trash" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PNote;
