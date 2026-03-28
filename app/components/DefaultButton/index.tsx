import { useEffect } from "react";

export default function DefaultButton( props : { children: React.ReactNode }) {

    useEffect( ()=> {
        alert("Componente DefaultButton montado!");
    }, [props.children]);

    return <button className="p-1 bg-green-500 rounded text-white font-bold cursor-pointer">{props.children}</button>;
}