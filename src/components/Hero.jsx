function Hero({ title, description, image }) {
    return (
        <section
            className="hero"
            aria-labelledby="hero-title"
            style={{ "--hero-image": `url(${image})` }}
        >
            <div className="hero-copy">
                <h1 id="hero-title">{title}</h1>
                <p className="hero-description">{description}</p>
                <a className="hero-action" href="#resources">
                    Explore resources
                    <span aria-hidden="true">-&gt;</span>
                </a>
            </div>
            <span className="hero-label">Learning Commons</span>
        </section>
    );
}

export default Hero;