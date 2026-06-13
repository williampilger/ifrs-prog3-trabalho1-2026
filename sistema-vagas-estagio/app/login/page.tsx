import { RiGraduationCapLine } from "react-icons/ri";

const Login = () => {
    return(
        <div className="flex justify-center items-center h-full w-full">
            <div className="flex flex-col items-baseline-last">
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary rounded p-2 w-fit">
                        <RiGraduationCapLine className="fill-white block" size={30}/>
                    </div>
                    <h1 className="text-primary">Sistema de Estágios</h1>
                    <span>IFRS CAMPUS FELIZ</span>
                </div>
                <form className="flex h-fit w-fit">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Login</h1>
                        <input type="text" placeholder="Usuário" className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input type="password" placeholder="Senha" className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Entrar</button>
                    </div>
                </form>
                <div className="">

                </div>
            </div>
        </div>
    )
}

export default Login;