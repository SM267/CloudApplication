import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

// ---------------- EVENTS ----------------
const EVENTS = [
  {
    id: 1,
    title: "Art Exhibition",
    city: "Delhi",
    date: "2026-01-25",
    price: 499,
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698"
  },
  {
    id: 2,
    title: "Music Concert",
    city: "Mumbai",
    date: "2026-02-10",
    price: 999,
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
  },
  {
    id: 3,
    title: "Tech Conference",
    city: "Bangalore",
    date: "2026-03-05",
    price: 1999,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: 4,
    title: "Startup Meetup",
    city: "Pune",
    date: "2026-02-18",
    price: 299,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  },
  {
    id: 5,
    title: "Food Carnival",
    city: "Goa",
    date: "2026-01-30",
    price: 399,
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0"
  }
];

export default function Dashboard({ onLogout }) {
  const userEmail = localStorage.getItem("userEmail");

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("events");
  const [qtyMap, setQtyMap] = useState({});

  // ---------------- AUTH GUARD ----------------
  useEffect(() => {
    if (!userEmail) {
      alert("Please login first");
      window.location.href = "/";
    }
  }, [userEmail]);

  // ---------------- LOAD EVENTS ----------------
  useEffect(() => {
    setEvents(EVENTS);
    const initQty = {};
    EVENTS.forEach(e => (initQty[e.id] = 1));
    setQtyMap(initQty);
  }, []);

  // ---------------- BOOK EVENT ----------------
  async function bookEvent(ev) {
    try {
      const res = await fetch(`${BASE_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: ev.title,
          userEmail,
          quantity: qtyMap[ev.id]
        })
      });

      if (!res.ok) throw new Error();
      alert("🎟 Booking confirmed!");
    } catch {
      alert("Booking failed");
    }
  }

  // ---------------- LOAD BOOKINGS ----------------
  async function viewBookings() {
    try {
      const res = await fetch(
        `${BASE_URL}/api/bookings?userEmail=${encodeURIComponent(userEmail)}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(data);
      setView("bookings");
    } catch {
      alert("Failed to load bookings");
    }
  }

  // ---------------- CANCEL BOOKING (FIXED) ----------------
async function cancelBooking(id) {
  if (!confirm("Cancel this booking?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/booking/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Cancel failed:", text);
      throw new Error();
    }

    await viewBookings(); // refresh from DB
  } catch (err) {
    alert("Cancellation failed");
    console.error(err);
  }
}



  // ---------------- UI ----------------
  return (
    <>
      <nav>
        <h2>Eventify</h2>
        <div className="actions">
          <span className="chip">{userEmail}</span>
          <button onClick={() => setView("events")}>Events</button>
          <button onClick={viewBookings}>My Bookings</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <section className="grid">
        {view === "events" &&
          events.map(ev => (
            <div className="card" key={ev.id}>
              <img src={ev.image} alt={ev.title} className="event-img" />

              <h3>{ev.title}</h3>
              <p>{ev.city}</p>
              <p>{ev.date}</p>
              <p>Price: ₹{ev.price}</p>

              <div className="qty">
                <button
                  onClick={() =>
                    setQtyMap(q => ({
                      ...q,
                      [ev.id]: Math.max(1, q[ev.id] - 1)
                    }))
                  }
                >
                  −
                </button>

                <span>{qtyMap[ev.id]}</span>

                <button
                  onClick={() =>
                    setQtyMap(q => ({
                      ...q,
                      [ev.id]: Math.min(10, q[ev.id] + 1)
                    }))
                  }
                >
                  +
                </button>
              </div>

              <p><strong>Total: ₹{ev.price * qtyMap[ev.id]}</strong></p>

              <button onClick={() => bookEvent(ev)}>Book</button>
            </div>
          ))}

        {view === "bookings" &&
          (bookings.length === 0 ? (
            <p className="muted">No bookings found.</p>
          ) : (
            bookings.map(b => (
              <div className="card" key={b._id}>
                <h3>{b.eventTitle}</h3>
                <p>Tickets: {b.quantity}</p>
                <p>Status: <strong>{b.status}</strong></p>
                <p className="muted">
                  {new Date(b.createdAt).toLocaleString()}
                </p>

                {b.status !== "cancelled" ? (
                  <button
                    className="danger"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                ) : (
                  <p className="muted">Cancelled</p>
                )}
              </div>
            ))
          ))}
      </section>
    </>
  );
}
