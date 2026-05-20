import { useState } from "react";

const profile = {
  name: "Raju Kumar",
  role: "MCA Student",
  department: "Department of Computer Science",
  institution: "CHRIST (Deemed to be University)",
  registration: "25046022",
  skills: ["React", "Tailwind CSS", "JavaScript", "UI Design"],
  stats: [
    { label: "Labs", value: "5" },
    { label: "Domain", value: "EMS" },
    { label: "Stack", value: "React" }
  ]
};

function ProfileCard({ person }) {
  const [following, setFollowing] = useState(false);

  return (
    <article className="profile-card">
      <div className="profile-header">
        <div className="avatar" aria-hidden="true">
          RK
        </div>
        <div>
          <p className="eyebrow">Lab 5 Profile Card</p>
          <h1>{person.name}</h1>
          <p className="role">{person.role}</p>
        </div>
      </div>

      <div className="details">
        <p>{person.department}</p>
        <p>{person.institution}</p>
        <p>Registration No. {person.registration}</p>
      </div>

      <ul className="skills" aria-label="Skills">
        {person.skills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <dl className="stats">
        {person.stats.map(item => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <button className="follow-button" onClick={() => setFollowing(current => !current)}>
        {following ? "Following" : "Follow Profile"}
      </button>
    </article>
  );
}

function App() {
  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">React + Vite</p>
        <h2>Reusable profile card using props and hooks.</h2>
        <p>
          This compact app demonstrates component composition, prop destructuring, array rendering, responsive layout, and a simple hook-based interaction.
        </p>
      </section>

      <ProfileCard person={profile} />
    </main>
  );
}

export default App;
