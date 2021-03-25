const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const openModal = function () {
	modalCart.classList.add('show');
};

const closeModal = function () {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', function (event) {
	if (event.target === modalCart || event.target === modalClose) {
		closeModal();
	}
});


//  scrollSmooth

(function() {
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', function(event) {
			event.preventDefault();
			const id = scrollLinks[i].getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		});
	}
})()


// goods

const more = document.querySelector('.more');
const navigationItem = document.querySelectorAll('.navigation-item');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибочка вышла ' + result.status;
	}
	return await result.json();
};

const createCard = function (objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	console.log(objCard);

	card.innerHTML = `
		<div class="goods-card">
			<span class="label">${objCard.label}</span>
			<img src="${objCard.img}" alt="image: ${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
				<span class="button-price">${objCard.price}</span>
			</button>
		</div>
	`;

	return card;
};

const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};

getGoods().then(renderCards);