'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' }); //new way but works only in modern browsers
});

//Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = el.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//However, this isn't really the best way to implement this functionality. We actually have the same code for all our nav items suppose there are 100 nav items then they would have the same code 100 items which will affect performance.

//1. A better solution would be to add event listeners to their common parent element
//2. Identify the element where the event actually occurred - (Application of bubbling)

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  //this is to ensure that even if we click the span inside button, the button gets clicked
  const clicked = e.target.closest('.operations__tab');

  //if neither of them gets clicked then null is returned
  if (!clicked) return;

  //Removing active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );

  //Adding active classes
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////Menu fade animation//////////////////////////////////

const nav = document.querySelector('.nav');
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

//Passing "arguments" to the handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   const initialCoords = section1.getBoundingClientRect();
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//Efficient way for sticky navigation : Intersection Observer API
const header = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //when our current view is completely out of viewport then trigger the sticky nav
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

////////////////Reveal Sections///////////////////////////////
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('.section');

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

////////////////////Lazy Loading//////////////////////////////////
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  //keeping the image blur until the original image is fully loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

const imgTargets = document.querySelectorAll('img[data-src]');
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////Slider///////////////////////////////////////
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

goToSlide(0);
createDots();
activateDot(0);
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide(currSlide);
  } else {
    nextSlide(currSlide);
  }
});
/* --------------------------------------------NOTES -----------------------------------------*/
/*
// Selecting, Creating and Deleting DOM Elements

//Selecting Elements
console.log(document.documentElement); //Entire HTML element
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section'); //selects every element with section class
console.log(allSections);
console.log(document.getElementById('section--1'));
console.log(document.getElementsByTagName('button')); //Returns HTML Collection and gets updated automatically
console.log(document.getElementsByClassName('btn'));

//Cretaing and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookied for improved functionality and analytics.';
message.innerHTML =

  'We used cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
  console.log(message);
  
  //message element can exist only at one place. (Here at append)
// header.prepend(message); //makes message element the first child element after header
// header.append(message);

// //To make it exists at 2 places simultaneously use cloneNode(true) on message
// header.append(message.cloneNode(true));

// header.before(message);
header.after(message);

//Delete elements
document
.querySelector('.btn--close-cookie')
.addEventListener('click', function () {
    // message.remove(); //new way
    message.parentElement.removeChild(message); //old way
  });
  
  //Styles, Attributes, and Classes
  
  //Styles
  message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); //cannot read properties that are not defined
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color); //can read properties that are not defined
console.log(getComputedStyle(message).height);

message.style.height =
Number.parseInt(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered'); //another way to set property

//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

//Non-standard attributes
console.log(logo.designer); //cannot be accessed like this
console.log(logo.getAttribute('designer')); //correct way to access
console.log(logo.setAttribute('company', 'Bankist'));

console.log(logo.src); //actual source
console.log(logo.getAttribute('src')); //relative source

//Data Attributes
console.log(logo.dataset.versionNumber); //the attribute name must start with data followed by anything else

//Classes
logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('j', 'd');
logo.classList.contains('c');

//Don't use this way to assign class as it would remove all the existing classes
// logo.classList = 'Aman';

//Different types of Event and Event handlers
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('EventListener : Great! You are reading the heading now.');
};

h1.addEventListener('mouseenter', alertH1);
setTimeout(function () {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);

//for every event there is a property like this but generally this way isn't used
// h1.onmouseenter = function (e) {
  //   alert('Property : Reading Again!');
  // };
  
  // Event Propagation in Practice
//Bubbling and Capturing
const randomInt = (max, min) => Math.floor(Math.random() * (max - min) + min);
const randomColor = () =>
`rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('NAV-LINK');
  console.log(e.target);
  console.log(e.currentTarget);
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('NAV-LINKS');
  console.log(e.target);
  console.log(e.currentTarget);
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  console.log('NAV');
  console.log(e.target);
  console.log(e.currentTarget);
  this.style.backgroundColor = randomColor();
});

//e.target = element where the actual event occurred
//e.currentTarget = current element where event is happening

// DOM Traversing
const h1 = document.querySelector('h1');

//Going downwards : Child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //list of every child nodes no matter how deep
console.log(h1.children); //list of direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orange';

//Going upwards : Parent
console.log(h1.parentElement);
console.log(h1.parentNode);
//both of them gives the direct parent

//closest() method gives the nearest parent no matter how high
h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('.h1').style.background = 'var(--gradient-primary)';

//Going sideways : Siblings - direct ones
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);

//If we want all the siblings then we can use the trick to reach the parent and then find all the children
console.log(h1.parentElement.children);

//Life Cycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and dom tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
*/
