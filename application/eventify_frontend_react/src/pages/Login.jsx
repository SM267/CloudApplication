export default function Login({ onLogin }) {
  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email) {
      alert("Enter email");
      return;
    }
    localStorage.setItem("userEmail", email);
    onLogin();
  }

  return (
    <main className="login-container">
      <h1>Welcome to Eventify</h1>
      <p className="sub">Sign in to explore and book events</p>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" required />

        <label>Password</label>
        <input type="password" required />

        <button type="submit">Login</button>
        <p className="muted">(Demo only: email stored locally)</p>
      </form>
    </main>
  );
}
