export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '34px',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: '55px',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #F5A623 0%, #FF1D6C 38.2%, #9C27B0 61.8%, #2979FF 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '21px',
      }}>
        🛣️ BlackRoad
      </h1>
      <h2 style={{
        fontSize: '34px',
        color: '#FF1D6C',
        marginBottom: '21px',
      }}>
        lucidia.studio
      </h2>
      <p style={{
        fontSize: '21px',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '34px',
        maxWidth: '600px',
      }}>
        Lucidia Studio - Creative AI Tools
      </p>
      <a
        href="https://blackroad.io"
        style={{
          display: 'inline-block',
          padding: '13px 34px',
          background: 'linear-gradient(135deg, #FF1D6C 0%, #9C27B0 100%)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        Explore BlackRoad OS →
      </a>
      <footer style={{
        marginTop: '55px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.5)',
      }}>
        © 2026 BlackRoad OS, Inc.
      </footer>
    </main>
  )
}
