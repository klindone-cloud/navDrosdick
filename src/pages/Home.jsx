import NavCard from "../components/NavCard";
import Hero from "../components/Hero";

function Home() {
    return (
        <main className="home">
            <Hero title="Navigating Drosdick Hall" description="Explore Villanova University's home for the College of Engineering." image="/images/learningCommons.jpg" />
            <section className="menu-grid" id="resources">
                <NavCard title="Directory" description="Explore the directory of resources." link="/directory" image="/images/learningCommons.jpg" />
            </section>
        </main>

    );
}

export default Home;