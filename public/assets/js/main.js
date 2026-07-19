/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message');

const sendEmail = (e) => {
    e.preventDefault(); // Prevent default form submission

    emailjs.sendForm('service_xrxe1zu', 'template_6fmag4b', '#contact-form', 'pkXRGXYYMgUNYmOjk')
    .then(() => {
        // Display success message
        contactMessage.textContent = 'Message sent successfully ✅';
        contactMessage.style.color = 'green';

        // Clear the message after 5 seconds
        setTimeout(() => {
            contactMessage.textContent = '';
        }, 5000);

        // Reset the form
        contactForm.reset();
    })
    .catch((error) => {
        // Display error message
        contactMessage.textContent = 'Failed to send message. Please try again.';
        contactMessage.style.color = 'red';
        console.error('EmailJS error:', error);
    });
};

// Attach event listener
contactForm.addEventListener('submit', sendEmail);


/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        // Fix: Check if the element exists before manipulating it
        const sectionsClass = document.querySelector(`.nav__list a[href="#${sectionId}"]`);

        if (sectionsClass) { // Only proceed if the element exists
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
            } else {
                sectionsClass.classList.remove('active-link');
            }
        }
    });
};

window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/

// Initialize ScrollReveal
const sr = ScrollReveal({
    origin: 'top',        // Animation starts from the top
    distance: '60px',     // Distance the element moves during the reveal
    duration: 2500,       // Animation duration in milliseconds
    delay: 400,           // Delay before the animation starts
    reset: true           // Enables repeating animations on scroll
  });
  
  // Apply ScrollReveal to elements
  sr.reveal(`.perfil , .contact__form`);
  sr.reveal('.info', { origin: 'left', delay: 800 });
sr.reveal('.skills', { origin: 'left', delay: 900 });
sr.reveal('.about', { origin: 'right', delay: 1200 });
sr.reveal('.projects__card, .services__card , .experience__card', { interval: 100 }); // Added the missing dot // Reveal the element with the 'perfil' class



