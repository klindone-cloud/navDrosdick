import NavCard from "../components/NavCard";

function Home() {
    return (
        <main className="home">
            <header className="header">
                <h1>Welcome to Navigating Drosdick</h1>
            </header>
            <section className="menu-grid">
                <NavCard title="Directory" description="Explore the directory of resources." link="/directory" image="/images/learningCommons.jpg" />
            </section>
        </main>

    );
}

export default Home;