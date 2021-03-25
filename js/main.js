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
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');



const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибочка вышла ' + result.status;
	}
	return await result.json();
};

const cart = {
	cartGoods: [],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus" data-id="${id}">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus" data-id="${id}">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete" data-id="${id}">x</button></td>
			`
			cartTableGoods.append(trGood);			
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0)

		cartTableTotal.textContent = totalPrice + '$';

		/* let totalCount = this.cartGoods.reduce((quantity, item) => {
			return quantity + item.count;
		}, 0)

		totalCount ? cartCount.textContent = totalCount : cartCount.textContent = '';  */
	},

	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},

	minusGood(id) {
		for (item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				}				
				break;
			}
		}
		this.renderCart();
	},

	plusGood(id) {
		for (item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},

	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
	},
}


document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
})

cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;
		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		} else if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		} else if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		}
	}	
})

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');	
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', event => {
	if (event.target === modalCart || event.target === modalClose) {
		closeModal();
	}
});

//  scrollSmooth

(function() {
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (let scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		});
	}
})()


// goods

const createCard = function ({ label, name, img, description, id, price }) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
		<div class="goods-card">
			${label ?
				 `<span class="label">${label}</span>` : ``}			
			<img src="${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
		</div>
	`;

	return card;
};

const renderCards = function(data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};

more.addEventListener('click', event => {
	event.preventDefault();
	getGoods().then(renderCards);
	document.body.scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	})
});

const filterCards = function(field, value) {
	getGoods()
		.then((data) => data.filter(good => good[field] === value))
		.then(renderCards);
};

navigationLink.forEach(function (link) {
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		field ? filterCards(field, value) : getGoods().then(renderCards);
	})
});


// Offer buttons

const offerButtons = document.querySelectorAll('.card.mb-4 > .button');
offerButtons.forEach((offerButton) => {
	offerButton.addEventListener('click', event => {
		// let targetParent = event.target.parentElement;
		let targetParent = event.target.closest('.card', 'mb-4');
		if (targetParent.classList.contains('card-1')) {
				filterCards('category', 'Accessories');
		} else if (targetParent.classList.contains('card-2')) {
				filterCards('category', 'Clothing');
		}
		document.body.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	})
});