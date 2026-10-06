import NavCard from "../components/NavCard";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import ImageCarousel from "../components/ImageCarousel";

function Home() {
    return (
        <main className="home">
            <NavBar/>
            <Hero title="Navigating Drosdick Hall" description="Explore Villanova University's home for the College of Engineering." image="/images/learningCommons.jpg" />
            <br />
            <ImageCarousel/>
        </main>

    );
}

export default Home;