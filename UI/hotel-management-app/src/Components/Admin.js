import React from "react";
import '../Styles/Admin.css';

function Admin() {
    return (
        <div className={"admin"}>
            <h1>Admin Tasks</h1>
            <div className={"list"}>
                <ul>
                    <li><button>Add meal</button></li>
                    <li><button>Delete user</button></li>
                    <li><button>Delete meal</button></li>
                    <li><button>Edit user role</button></li>
                </ul>
            </div>
        </div>
    );
}

export default Admin;
