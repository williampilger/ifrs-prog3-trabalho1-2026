import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicoLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background-alt">
            <Header />
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
