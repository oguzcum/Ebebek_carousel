(() => {
    const API_URL = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0';
    const Web_URL = "https://www.e-bebek.com/";
    let translateValue = 0;

    const init = () => {
        if (document.URL == Web_URL) {
            buildHTML();
            fetchProducts();
            setEvents();
            updateStylesBasedOnWindowSize(); 
            window.addEventListener('resize', updateStylesBasedOnWindowSize); 
        } else {
            console.log("wrong page");
        }
    };

    const buildHTML = () => {
        const html = `
            <eb-product-carousel>
                <div class="banner">
                    <div class="container">
                        <eb-carousel-header class="ng-star-inserted">
                            <div class="banner__titles">
                                <h2 class="title-primary"> Beğenebileceğinizi düşündüklerimiz </h2>
                            </div>
                        </eb-carousel-header>
                        <div class="banner__wrapper ins-preview-wrapper-10167 ng-star-inserted">
                            <div>
                                <owl-carousel-o class="product-list__best-products">
                                    <div class="owl-carousel owl-theme owl-loaded owl-responsive owl-drag">
                                        <div class="owl-stage-outer ng-star-inserted">
                                            <owl-stage>                                      
                                                    <div class="carouselevent owl-stage " 
                                                        style="width: 500%; transform: translate3d(0px, 0px, 0px); transition: all 0.3s ease;">
                                                        <div class="product-list"></div>
                                                    </div>  
                                            </owl-stage>
                                        </div>
                                        <div class="owl-nav disabled ng-star-inserted">
                                            <div class="owl-prev">
                                                <i class="icon icon-prev"></i>
                                            </div>
                                            <div class="owl-next">
                                                <i class="icon icon-next"></i>
                                            </div>
                                        </div>
                                    </div>
                                </owl-carousel-o>    
                                <button aria-label="back" class="swiper-prev"></button>
                                <button aria-label="next" class="swiper-next"></button>
                            </div>    
                        </div>
                    </div>
                </div>
            </eb-product-carousel>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    };

    const fetchProducts = async () => {
        let cachedProducts = localStorage.getItem('products');
    
        if (cachedProducts) {
            renderProducts(JSON.parse(cachedProducts));
        } else {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Veri alınamadı!");
    
                const products = await response.json();
 
                const productsFavorite = products.map(product => ({
                    ...product,
                    isFavorite: false
                }));
                localStorage.setItem('products', JSON.stringify(productsFavorite));
                renderProducts(productsFavorite);
            } catch (error) {
                console.error("Ürünler alınırken hata oluştu:", error);
            }
        }
    };

    const setEvents = () => {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('heart-icon')) {
                toggleFavorite(event);
            }
            if (event.target.classList.contains('swiper-next')) {
                if (translateValue <= -786){
                    return
                }
                updateCarousel(-262);
            }
            if (event.target.classList.contains('swiper-prev')) {
                if (translateValue >= 0){
                    return
                }
                updateCarousel(262);
            }
        });
    };

    const toggleFavorite = (event) => {
        const productItem = event.target.closest('.product-item');
        if (!productItem) {
            console.error('Product card not found');
            return;
        }
    
        const productId = productItem.id;
        const products = JSON.parse(localStorage.getItem('products'));
        const product = products.find(p => p.id == productId); 
    

        const heartIcon = productItem.querySelector('.heart');
        if (product.isFavorite) {
            heartIcon.style.backgroundColor = 'orange'; 
            
        } else {
            heartIcon.style.backgroundColor = ''; 
        }
       
            product.isFavorite = !product.isFavorite; 
            localStorage.setItem('products', JSON.stringify(products)); 
     
            
        
            
        
    };

    const updateCarousel = (change) => {
        const stage = document.querySelector('.carouselevent');
        if (stage) {
            translateValue += change;
            stage.style.transform = `translate3d(${translateValue}px, 0px, 0px)`;
        }
    };

    const renderProducts = (products) => {
        const productList = document.querySelector('.product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const discount = product.price < product.original_price
                ? `<div class="d-flex align-items-center ng-star-inserted">
                        <span class="product-item__old-price ng-star-inserted">${product.original_price}</span>
                        <span class="product-item__percent carousel-product-price-percent ml-2 ng-star-inserted">
                            ${calculateDiscount(product.original_price, product.price)}%
                            <i class="icon icon-decrease"></i>
                        </span>
                    </div>
                        <span class="product-item__new-price discount-product ng-star-inserted">${product.price}</span>`
                : `
                    <span class="product-item__new-price ng-star-inserted">${product.price}</span>
                `;

            const favoriteIcon = product.isFavorite
                ? 'background-color:orange'
                : '';

            const productCard = `
                <div class="owl-item ng-tns-c125-3 ng-trigger ng-trigger-autoHeight active ng-star-inserted" style="margin-right:20px; width: 242px">
                    <eb-carousel-product-item>
                        <div class="product-item" id=${product.id}>
                            <eb-generic-link class="product-item-anchor">
                                <a target="_blank" class="product-item-anchor ng-star-inserted" href="${product.url}">
                                    <figure class="product-item__img ng-star-inserted">
                                        <cx-media class="is-initialize">
                                            <img class="ng-star-inserted ls-is-cached lazyloaded" src="${product.img}">
                                        </cx-media>
                                    </figure>
                                    <div class="product-item-content ng-star-inserted">
                                        <h2 class="product-item__brand ng-star-inserted">
                                            <b>${product.brand} - </b>
                                            <span>${product.name}</span>
                                        </h2>
                                        <div class="d-flex mb-2 stars-wrapper align-items-center ng-star-inserted">
                                    </div>
                                    <div class="product-item__price">
                                        ${discount}
                                    </div>
                                    <div class="product-list-promo ng-star-inserted"></div> 
                            </eb-generic-link>
                            </a>
                            <eb-add-to-wish-list>
                                <button class=ng-star-inserted> 
                                    <div class="heart" style="${favoriteIcon}">
                                        <img id="default-favorite" src="assets/svg/default-favorite.svg"  alt="heart" class="heart-icon">
                                        <img src="assets/svg/default-hover-favorite.svg" alt="heart" class="heart-icon hovered">
                                    </div>
                                </button>
                            </eb-add-to-wish-list>
                        </div>
                            <div class="product-item-content">
                                <div class="product-item__price">
                                    <div class="ins-add-to-cart-wrapper">
                                        <eb-add-to-cart buttonclass="close-btn">
                                            <form novalidate class="ng-untouched ng-pristine ng-valid ng-star-inserted">
                                                <button id="addToCartBtn" type="submit" class="btn close-btn disable ng-star-inserted">Sepete Ekle</button>
                                            </form>
                                        </eb-add-to-cart>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                    </eb-carousel-product-item>
                </div>
            `;
            productList.insertAdjacentHTML('beforebegin', productCard);
        });
    };

    const calculateDiscount = (originalPrice, price) => {
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    };

    const updateStylesBasedOnWindowSize = () => {
        const stage = document.querySelector('.carouselevent');
        const items = document.querySelectorAll('.owl-item');

        if (window.innerWidth < 1580) {
            stage.style.width = '3858px';
            items.forEach(item => {
                item.style.width = '237.2px';
           
            });
        }

        if (window.innerWidth < 1480) {
            stage.style.width = '4388px';
            items.forEach(item => {
                item.style.width = '272.5px';
                
            });
        }

        if (window.innerWidth < 1280) {
            stage.style.width = '4751px';
            items.forEach(item => {
                item.style.width = '296.667px';
               
            });
        }
        
        if (window.innerWidth < 990) {
            stage.style.width = '5325px';
            items.forEach(item => {
                item.style.width = '335px';
           
            });
        }

        if (window.innerWidth < 770) {
            stage.style.width = '3975px';
            items.forEach(item => {
                item.style.width = '245px';
           
            });
        }
        
        if (window.innerWidth <= 430) {
            stage.style.width = '3150px';
            items.forEach(item => {
                item.style.width = '190px';
           
            });
        }


    };

    init();
})();