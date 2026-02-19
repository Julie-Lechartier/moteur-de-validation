import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { users } = useContext(UserContext);

  return (
    <div className="home-container">
      <h1>Accueil</h1>

      <p className="user-count" data-testid="user-count">
        {users.length} utilisateur(s) inscrit(s)
      </p>

      <ul className="user-list" data-testid="user-list">
        {users.map((user, index) => (
          <li key={index} className="user-item">
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>

      <Link to="/register" className="home-link">
        Aller au formulaire
      </Link>
    </div>
  );
}
