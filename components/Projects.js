export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "D-MART Analysis",
      description: "This project offers a deep dive into D-Mart's grocery sales data, providing key business insights and a highly accurate machine learning model for future sales forecasting.",
      image: "/assets/img/ANALYSIS.png",
      link: "https://ltqapcfmatgt2.mocha.app/",
      skills: ["/assets/img/python.svg"]
    },
    {
      id: 2,
      title: "Carspace",
      description: "A web app for buying and selling second-hand cars, integrated with Firebase for real-time data and user authentication, built with React and Tailwind CSS.",
      image: "/assets/img/Carspace.png",
      link: "https://secondhandcarapp.web.app/",
      skills: ["/assets/img/skills-react.svg", "/assets/img/skills-html.svg", "/assets/img/skills-tailwind-css.svg", "/assets/img/firebase-svgrepo-com.svg"]
    },
    {
      id: 3,
      title: "D7 Sports",
      description: "A sports management platform with real-time updates and analytics, powered by MongoDB for data storage and React for the frontend.",
      image: "/assets/img/D7.png",
      link: "https://drive.google.com/file/d/18_hxmycJTo6qIy9MebsEbzJyGbl6s_Tz/view?usp=sharing",
      skills: ["/assets/img/skills-react.svg", "/assets/img/skills-html.svg", "/assets/img/skills-css.svg", "/assets/img/MongoDB.svg"]
    },
    {
      id: 4,
      title: "Interior Design Prototype",
      description: "An interactive desktop prototype for interior design visualization, showcasing minimalist aesthetics with React and Tailwind CSS.",
      image: "/assets/img/White and Brown Minimalist Interior Desktop Prototype.gif",
      link: "#",
      skills: ["/assets/img/skills-react.svg", "/assets/img/skills-html.svg", "/assets/img/skills-tailwind-css.svg"]
    },
    {
      id: 5,
      title: "AR Mart",
      description: "An augmented reality shopping platform that allows users to visualize products in 3D before purchase, built with React and AR.js for an immersive experience.",
      image: "/assets/img/AR_Mart.png",
      link: "#",
      skills: ["/assets/img/skills-react.svg", "/assets/img/skills-html.svg", "/assets/img/skills-tailwind-css.svg", "/assets/img/unity-svgrepo-com.svg"]
    },
    {
      id: 6,
      title: "PricePulse",
      description: "A price comparison website that aggregates data from multiple e-commerce platforms, designed with React and styled using Tailwind CSS for a sleek UI.",
      image: "/assets/img/Comapre_website.png",
      link: "#",
      skills: ["/assets/img/skills-react.svg", "/assets/img/skills-html.svg", "/assets/img/skills-tailwind-css.svg", "/assets/img/python.svg"]
    },
    {
      id: 7,
      title: "Namwear Oversized T-shirt Design",
      description: "A modern T-shirt design for Namwear's Oversized collection, crafted in Figma with a pastel gradient aesthetic and interactive prototyping.",
      image: "/assets/img/Screenshot 2025-03-05 at 10.16.27 AM.png",
      link: "https://www.figma.com/proto/TX6zJj6Lz5934ZjVsanK5M/vs?page-id=0%3A1&node-id=984-372&viewport=-20038%2C-5262%2C0.31&t=zYGrmhAeN2Xhj9fw-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1004%3A291&show-proto-sidebar=1",
      skills: ["/assets/img/skills-figma.svg"]
    }
  ]

  return (
    <section className="projects section" id="projects">
      <h2 className="section__title">RECENT PROJECTS</h2>
      <div className="projects__container container grid">
        {projects.map(project => (
          <article key={project.id} className="projects__card">
            <a href={project.link} target="_blank" className="projects__image">
              <img src={project.image} alt={project.title} className="projects__img" />
            </a>
            <div className="projects__data">
              <h3 className="projects__name">{project.title}</h3>
              <p className="project__discription" style={{color: '#555555'}}>
                {project.description}
              </p>
              <div className="projects__skills">
                {project.skills.map((skill, index) => (
                  <img key={index} src={skill} alt="Skill" className="projects__skill" />
                ))}
              </div>
              <a href={project.link} target="_blank" className="projects__button">
                <i className="ri-link"></i>
                <span>Visit Project</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}