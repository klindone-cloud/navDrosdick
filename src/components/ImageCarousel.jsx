import { useState } from "react";

export const images = [
    {
        url: "/images/carousel/hg.jpg",
        title: "Holy Grounds at Drosdick Hall",
        description: "Drosdick Hall is home to a Holy Grounds cafe where students, faculty and staff can refuel and catch up over a cup of coffee. It's an ideal space to build Caritas with colleagues between meetings, classes or labs."
    },
    {
        url: "/images/carousel/innovationLab.jpg",
        title: "Innovation Lab",
        description: "Drosdick Hall has enabled the College of Engineering to increase its research space by more than 60% through the inclusion of nearly two dozen new state-of-the-art laboratories. These innovative labs have been designed to facilitate creativity around topical areas of research, including Biomaterials and Polymers, Robotics and Autonomous Systems, and Healthcare Monitoring and Communications."
    },
    {
        url: "/images/carousel/learningCommons.jpg",
        title: "Jones Family Learning Commons",
        description: "A gathering space at the heart of Drosdick Hall, the Jones Family Learning Commons was designed with community in mind. The three-story, light-filled atrium is an ideal space for students of all majors to gather in study groups or meet informally between classes."
    },
    {
        url: "/images/carousel/greenRoofs.jpg",
        title: "Green Roofs",
        description: "Lab space in Drosdick Hall stretches beyond the building's walls to include three green roofs, adding to the extensive living laboratory of green stormwater infrastructure already on Villanova's campus. These sites not only help manage the building's stormwater runoff, but also they serve as testbeds for students to gain skills that will place them at the forefront of sustainable stormwater management practices."
    },
    {
        url: "/images/carousel/graduateSpaces.jpg",
        title: "Graduate Spaces",
        description: "Master's and doctoral students have dedicated spaces within Drosdick Hall, enhancing their on-campus experience--and strengthening the learning environment for all. With centrally located offices and communal areas, Drosdick Hall seamlessly weaves this growing group of engineers in with the greater College community, underscoring their important contributions both in research labs and in the classroom."
    },
    {
        url: "/images/carousel/classrooms.jpg",
        title: "Multifunctional Classrooms",
        description: "Instructional spaces in Drosdick Hall have been designed to adapt to the needs of the College. The Dionisio Family Lecture Hall provides state-of-the-art instructional technologies to support student learning and is also an ideal space for hosting lectures, open houses and other large gatherings."
    },
    {
        url: "/images/carousel/labs.jpg",
        title: "Multidisciplinary Labs",
        description: "Drosdick Hall has enabled the College of Engineering to increase its research space by more than 60% through the inclusion of nearly two dozen new state-of-the-art laboratories. These innovative labs have been designed to facilitate creativity around topical areas of research, including Biomaterials and Polymers, Robotics and Autonomous Systems, and Healthcare Monitoring and Communications."
    }
];

function CarouselCard({ image }) {
  return (
    <article className="carousel-card">
      <div className="carousel-image">
        <img
          src={image.url}
          alt={image.title}
        />
      </div>

      <div className="carousel-text-content">
        <h2>{image.title}</h2>
        <p>{image.description}</p>
      </div>
    </article>
  );
}

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = images[currentIndex];

  function showPreviousImage() {
    setCurrentIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );
  }

  function showNextImage() {
    setCurrentIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    );
  }

  return (
    <section
      className="image-carousel"
      aria-label="Drosdick Hall image gallery"
    >
      <h2 className="carousel-heading">
        Explore Drosdick Hall
      </h2>

      <div className="carousel-content">
        <button
          type="button"
          className="carousel-button previous"
          onClick={showPreviousImage}
          aria-label="Previous image"
        >
          ←
        </button>

        <CarouselCard image={currentImage} />

        <button
          type="button"
          className="carousel-button next"
          onClick={showNextImage}
          aria-label="Next image"
        >
          →
        </button>
      </div>

      <div className="carousel-dots">
        {images.map((image, index) => (
          <button
            key={image.title}
            type="button"
            className={
              index === currentIndex
                ? "carousel-dot active"
                : "carousel-dot"
            }
            onClick={() => setCurrentIndex(index)}
            aria-label={`Show ${image.title}`}
          />
        ))}
      </div>
    </section>
  );
}

export default ImageCarousel;

/*
function CarouselCard(img){
    console.log("I'm in carousel card.");
    console.log(img);
    console.log(img.url);
    return(
        <div className = "carouselCard">
            <h2>Card</h2>
            <div className = "carImage">
                <img src={img.url}></img>
            </div>
            <div className="carTextContent">
                <h1>{img.title}</h1>
                <p>{img.description}</p>
            </div>
        </div>
    );
}

function ImageCarousel(){
    images.map((image) => {
    return(
        <div>
            <h1 style={{color:"black"}}>Image Carousel</h1>
            {CarouselCard(image)}
        </div>
    );
})
}

export default ImageCarousel;
*/