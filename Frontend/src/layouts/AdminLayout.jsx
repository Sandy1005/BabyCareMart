import Sidebar from "../components/Admin/Sidebar/Sidebar";
import Topbar from "../components/Admin/Topbar/Topbar";

import "../styles/Admin/AdminLayout.css";

function AdminLayout({ children }) {

    return (

        <div className="admin-layout">

            <Sidebar />

            <div className="admin-main">

                <Topbar />

                <main className="admin-content">

                    {children}

                </main>

            </div>

        </div>

    );

}

export default AdminLayout;