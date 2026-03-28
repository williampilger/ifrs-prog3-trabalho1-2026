import DefaultButton from "~/components/DefaultButton";
import type { Route } from "./+types/home";
import DefaultInput from "~/components/DefaultInput";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



export default function TestePage() {

    const [teste, setTeste] = useState("Valor do input");
  return <>
    <span>Olá, Mundo!</span>
    <br />
    <DefaultButton>{teste}</DefaultButton>
    <br />
    <input type="text" value={teste} onChange={e=>{
        setTeste(e.target.value)
    }}/>
    {/*<DefaultInput/> */}
  </>
}
