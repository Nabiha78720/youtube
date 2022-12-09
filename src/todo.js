import React from "react";

function Edit() {
    return (
        <div>Edit</div>
    )
}

export default function ToDo() {

    const [id, setId] = React.useState(-1);
    return (
        <div>
            <button onClick={(index) => {
                setId(index)
            }}>Edit</button>
        </div>
    )
}