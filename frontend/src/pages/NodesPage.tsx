import {useState, useEffect} from "react";


export default function NodesPage(){
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/nodes")
            .then((response) => response.json())
            .then((data) => setNodes(data))
            .catch(() => console.error("Could not fetch nodes"));
    }, []);
    
    const stringJson = JSON.stringify(nodes, null, 2);
    console.log(stringJson);

    return(
        <div className='bg-yellow-300'>
            <h1>NodesPage</h1>
        </div>
    )
}