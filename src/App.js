import { useState, useEffect } from "react";
import './App.css';
import { User } from "./components/User";
import React from "react";



function App() {

    const [toDo, setToDo] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await fetch("https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10")
            .then((response) => response.json())
            .then((data) => setToDo(data))
            .catch((error) => console.log(error));
    };



    const handleOnSubmit = async (evt) => {

        evt.preventDefault();
        const title = evt.target.task.value
        const completed = evt.target.completed.value

        await fetch("https://jsonplaceholder.typicode.com/todos/", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                completed: completed,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => {
                    if (response.status !== 201) {
                        console.log("Post method failed")
                    } else {
                        console.log("Post method was success")
                        return response.json();
                    }
            })
            .then((data) => {

                const getLastId = toDo[toDo.length -1 ]
                const setLastId = getLastId.id
                data.id = setLastId + 1
                setToDo((toDo) => [...toDo, data]);

                }
            )
            evt.target.task.value = ""
            evt.target.completed.value = ""
    };

    const onEdit = async (id, title, completed) => {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: title,
                completed: completed
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => {
                if (response.status !== 200) {
                    console.log("Put method error")
                } else {
                    console.log("Put method success")
                    return response.json();
                }
            })
            .then((data) => {
                const updatedUsers = toDo.map((list) => {
                    if (list.id === id) {
                        list.title = title;
                        list.completed = completed;
                    }
                    return list;
                });

                setToDo((toDo) => updatedUsers);
            })
            .catch((error) => console.log(error));
    };

    const onDelete = async (id) => {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "DELETE"
        })
            .then((response) => {
                if (response.status !== 200) {
                    console.log("Delete method error")
                } else {
                    console.log("Delete method success")
                    setToDo(
                        toDo.filter((ToDo) => {
                            return ToDo.id !== id;
                        })
                    );
                }
            })
            .catch((error) => console.log(error));
    };



    return (
        <div className="App">
            <h1 className={"text-center"} >To Do List</h1>

            <div className={"newToDoForm"}>
                <form onSubmit={handleOnSubmit}>
                    <h5>Add new ToDo item</h5>
                    <input placeholder="Task name" name="task" id={"AddingTaskTitleInput"} />
                    <input placeholder="Is completed?" name="completed" id={"AddingTaskCompletedInput"}/>
                    <button onSubmit={handleOnSubmit} id={"AddButton"}>Add</button>
                    <hr />
                </form>
            </div>

           <div className={"container header"}>
               <div className={"row"}>
                <div className={"col"}>ID</div>
                <div className={"col-6"}>Assignment name</div>
                <div className={"col"}>Is completed?</div>
                <div className={"col"}>Edit assignment</div>
               </div>
           </div>
            {toDo.map((list) => (
            <User key={list.id}
                id={list.id}
                title={list.title}
                completed={list.completed}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            ))}
        </div>
    );
}

export default App;