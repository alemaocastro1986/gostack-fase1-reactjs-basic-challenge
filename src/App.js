import React, {useState, useEffect} from "react";
import {GrLike} from 'react-icons/gr'
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(()=>{
    api.get('/repositories').then(res => {
      const {data} = res  
      setRepositories(data) 
    })
    
  },[])
  async function handleAddRepository() {
    const {data} = await api.post('repositories', 
      {
        url: "https://github.com/alemaocastro1986/gostack-react",
        title: "GoStack - Repository",
        techs: [
          "React",
          "Axios",
          "TypeScript"
        ]
      }
    )
    setRepositories([...repositories, data])
  }

  async function handleRemoveRepository(id) {
    const {status} = await api.delete(`repositories/${id}`)
    if(status === 204){
      setRepositories(repositories.filter(rep => rep.id !== id))
    }
  }

  async function handleAddLikeRepository(id) {
    const {data} = await api.post(`repositories/${id}/like`)    
    setRepositories(repositories.map(r => {
      if(r.id === id){
        r.likes = data.likes
      }
      return r
    }))
  }

  return (
    <div className="container">
      <ul data-testid="repository-list">
        {
          repositories.map(repo =>(
            <li key={repo.id} className="repository-item">
             <div className="repository-info">
                <div className="repository-header">
                  <strong>{repo.title}</strong>
                  <div>
                      <button type="button" onClick={() => handleAddLikeRepository(repo.id)}>
                        <GrLike size={18} /> {repo.likes}
                      </button>
                  </div>
                </div>
                <hr/>
                <small>{repo.url}</small>
                <div>
                    {repo.techs.map(tech =>(
                      <span key={repo.id + tech}>{tech}</span>
                      ))}
                </div>                
             </div>
              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          ))
        }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
