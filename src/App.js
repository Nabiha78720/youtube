import axios from "axios";
import React from "react";

// const url =
//   process.env.NODE_ENV === "production"
//     ? "https://timely-choux-d3b6aa.netlify.app"
//     : "http://localhost:4000";
const url = "http://localhost:4000";

function App() {

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    file: null,
  });

  const handleChange = (evt) => {
    const inputValue = evt.target.name === "file" ? evt.target.files[0] : evt.target.value;

    setForm({
      ...form,
      [evt.target.name]: inputValue
    })
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const videoData = new FormData();

    videoData.append("videoFile",form.file);
    videoData.append("title",form.title);
    videoData.append("description",form.description);

    axios.post(`${url}/uploadvideo`,videoData)
    .then(res=>{
      console.log(res.data);
    })


    console.log({ form });
  }

  return (
    <div>
      <h1>Upload youtube video</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input onChange={handleChange} type={"text"} name="title" autoComplete="off" placeholder="Title" />
        </div>
        <div>
          <textarea onChange={handleChange} type={"text"} name="description" autoComplete="off" placeholder="Description" />
        </div>
        <div>
          <input onChange={handleChange} accept="video/mp4" type={"file"} name="file" placeholder="Add Video File" />
        </div>
        <button type="submit">Upload Video </button>
      </form>

    </div>
  );
}

export const Success = () => {
  return (
    <div>Success</div>
  )
}

export default App;
