import { Outlet } from "react-router";
import HeaderLogado from "../components/HeaderLogado";
import Footer from "../components/Footer";

export default function PrivadoLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background-alt">
            <HeaderLogado nome="Tech Corp Ltda" iniciais="TC" />
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
