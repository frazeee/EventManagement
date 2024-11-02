import React, {useEffect, useState} from "react";
import { supabase } from "../API/createClient";

const App = () => {

    const [guests, setGuests] = useState([]);
    console.log(guests);

    useEffect(() => {
        fetchGuests();
    }, []);

    async function fetchGuests(){
        const {data} = await supabase.from('guests').select("*")
        console.log("data",data);

        setGuests(data);
        
    }

    return (
        <div>
        <h1>Event Management</h1>
        </div>
    );
}

export default App;