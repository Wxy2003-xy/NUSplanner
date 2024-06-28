import { useState } from "react";


function getStoredName() :string{
    return window.localStorage.getItem("name")??"";
}

function setStoredName(newName:string) :void{
    window.localStorage.setItem("names", JSON.stringify(newName));
}

function getStoredTasks() :string{
    return window.localStorage.getItem("name")??"";
}

function setStoredTasks(newTasks:string) :void{
    window.localStorage.setItem("names", JSON.stringify(newTasks));
}

function setName(newName:string):void {

}

function handleNameChange() {
    const newName:string = prompt("Please enter your name")!;
    if (newName.length == 0) {
      setName("");
    } else {
      setName(newName);
      setStoredName(newName)
    }
}
