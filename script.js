class BundleBuilder {
    constructor() {
        this.selectedProducts = new Map();
        this.requiredItems = 3;
        this.discountPercentage = 30;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        document.querySelectorAll('.add-to-bundle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleProductToggle(e));
        });

        document.getElementById('addToCartBtn').addEventListener('click', () => this.handleAddToCart());
    }

    handleProductToggle(event) {
        const button = event.currentTarget;
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId;
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(button.dataset.price);
        const productImage = productCard.querySelector('img').src;

        if (this.selectedProducts.has(productId)) {
            this.removeProduct(productId);
            this.updateButtonState(button, false);
            productCard.classList.remove('selected');
        } else {
            this.addProduct(productId, {
                name: productName,
                price: productPrice,
                image: productImage
            });
            this.updateButtonState(button, true);
            productCard.classList.add('selected');
        }

        this.updateUI();
    }

    addProduct(productId, productData) {
        this.selectedProducts.set(productId, productData);
    }

    removeProduct(productId) {
        this.selectedProducts.delete(productId);
    }

    updateButtonState(button, isAdded) {
        const btnText = button.querySelector('.btn-text');
        const btnIcon = button.querySelector('.btn-icon');

        if (isAdded) {
            button.classList.add('added');
            btnText.textContent = 'Added ✓';
            
            btnIcon.innerHTML = `
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1905 5.53066L7.19051 13.5307C7.12083 13.6006 7.03804 13.6561 6.94687 13.6939C6.85571 13.7318 6.75797 13.7513 6.65926 13.7513C6.56055 13.7513 6.46281 13.7318 6.37165 13.6939C6.28048 13.6561 6.19769 13.6006 6.12801 13.5307L2.62801 10.0307C2.55825 9.9609 2.5029 9.87807 2.46515 9.78692C2.42739 9.69577 2.40796 9.59807 2.40796 9.49941C2.40796 9.40075 2.42739 9.30305 2.46515 9.2119C2.5029 9.12075 2.55825 9.03793 2.62801 8.96816C2.69777 8.8984 2.7806 8.84306 2.87175 8.8053C2.9629 8.76754 3.0606 8.74811 3.15926 8.74811C3.25792 8.74811 3.35562 8.76754 3.44677 8.8053C3.53792 8.84306 3.62075 8.8984 3.69051 8.96816L6.65988 11.9375L14.1293 4.46941C14.2702 4.32851 14.4613 4.24936 14.6605 4.24936C14.8598 4.24936 15.0509 4.32851 15.1918 4.46941C15.3327 4.61031 15.4118 4.8014 15.4118 5.00066C15.4118 5.19992 15.3327 5.39101 15.1918 5.53191L15.1905 5.53066Z" fill="white"/>
                </svg>
            `;
        } else {
            button.classList.remove('added');
            btnText.textContent = 'Add to Bundle';
            
            btnIcon.innerHTML = `
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.9099 8.5C14.9099 8.69891 14.8309 8.88968 14.6902 9.03033C14.5496 9.17098 14.3588 9.25 14.1599 9.25H9.40991V14C9.40991 14.1989 9.33089 14.3897 9.19024 14.5303C9.04959 14.671 8.85882 14.75 8.65991 14.75C8.461 14.75 8.27023 14.671 8.12958 14.5303C7.98893 14.3897 7.90991 14.1989 7.90991 14V9.25H3.15991C2.961 9.25 2.77023 9.17098 2.62958 9.03033C2.48893 8.88968 2.40991 8.69891 2.40991 8.5C2.40991 8.30109 2.48893 8.11032 2.62958 7.96967C2.77023 7.82902 2.961 7.75 3.15991 7.75H7.90991V3C7.90991 2.80109 7.98893 2.61032 8.12958 2.46967C8.27023 2.32902 8.461 2.25 8.65991 2.25C8.85882 2.25 9.04959 2.32902 9.19024 2.46967C9.33089 2.61032 9.40991 2.80109 9.40991 3V7.75H14.1599C14.3588 7.75 14.5496 7.82902 14.6902 7.96967C14.8309 8.11032 14.9099 8.30109 14.9099 8.5Z" fill="#24272B"/>
                </svg>
            `;
        }
    }

    updateUI() {
        this.updateProgress();
        this.updateSelectedProducts();
        this.updatePricing();
        this.updateAddToCartButton();
    }

    updateProgress() {
        const selectedCount = this.selectedProducts.size;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressPercentage = Math.min((selectedCount / this.requiredItems) * 100, 100);

        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${selectedCount}/${this.requiredItems} added`;
    }

    updateSelectedProducts() {
        const selectedProductsContainer = document.getElementById('selectedProducts');
        const emptyState = selectedProductsContainer.querySelector('.empty-state');

        if (this.selectedProducts.size === 0) {
            selectedProductsContainer.innerHTML = '<p class="empty-state">Select products to build your bundle</p>';
            return;
        }

        if (emptyState) {
            emptyState.remove();
        }

        const existingProducts = selectedProductsContainer.querySelectorAll('.selected-product-item');
        existingProducts.forEach(product => product.remove());

        this.selectedProducts.forEach((product, productId) => {
            const productElement = this.createSelectedProductElement(productId, product);
            selectedProductsContainer.appendChild(productElement);
        });
    }

    createSelectedProductElement(productId, product) {
        const productElement = document.createElement('div');
        productElement.className = 'selected-product-item';
        productElement.dataset.productId = productId;

        productElement.innerHTML = `
            <div class="selected-product-thumb">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="selected-product-details">
                <div class="selected-product-name">${product.name}</div>
                <div class="selected-product-price">$${product.price.toFixed(2)}</div>
            </div>
            <button class="remove-product-btn" onclick="bundleBuilder.removeFromSidebar('${productId}')">
                Remove
            </button>
        `;

        return productElement;
    }

    removeFromSidebar(productId) {
        this.selectedProducts.delete(productId);

        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        const button = productCard.querySelector('.add-to-bundle-btn');
        this.updateButtonState(button, false);
        productCard.classList.remove('selected');

        this.updateUI();
    }

    updatePricing() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        const discountInfo = document.getElementById('discountInfo');
        const discountLine = document.getElementById('discountLine');
        const discountAmount = document.getElementById('discountAmount');

        if (this.selectedProducts.size >= this.requiredItems) {
            discountInfo.style.display = 'flex';
            discountLine.style.display = 'flex';
            discountAmount.textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountInfo.style.display = 'none';
            discountLine.style.display = 'none';
        }
    }

    calculateSubtotal() {
        let subtotal = 0;
        this.selectedProducts.forEach(product => {
            subtotal += product.price;
        });
        return subtotal;
    }

    calculateDiscount(subtotal) {
        if (this.selectedProducts.size >= this.requiredItems) {
            return subtotal * (this.discountPercentage / 100);
        }
        return 0;
    }

    updateAddToCartButton() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        if (this.selectedProducts.size >= this.requiredItems) {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Add Bundle to Cart';
        } else {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = `Add ${this.requiredItems - this.selectedProducts.size} more item${this.requiredItems - this.selectedProducts.size !== 1 ? 's' : ''} to unlock`;
        }
    }

    handleAddToCart() {
        if (this.selectedProducts.size < this.requiredItems) {
            return;
        }

        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;

        const bundleSummary = {
            products: Array.from(this.selectedProducts.entries()).map(([id, product]) => ({
                id,
                name: product.name,
                price: product.price
            })),
            subtotal: subtotal,
            discount: discount,
            total: total,
            savings: discount
        };

        console.log('Bundle added to cart:', bundleSummary);
        
        this.showSuccessMessage(bundleSummary);
    }

    showSuccessMessage(bundleSummary) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        notification.innerHTML = `
            <h4 style="margin: 0 0 10px 0; font-size: 1.1rem;">Bundle Added to Cart!</h4>
            <p style="margin: 0 0 10px 0; font-size: 0.9rem;">
                ${bundleSummary.products.length} items • Saved $${bundleSummary.savings.toFixed(2)}
            </p>
            <p style="margin: 0; font-weight: 600; font-size: 1.1rem;">
                Total: $${bundleSummary.total.toFixed(2)}
            </p>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);

        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bundleBuilder = new BundleBuilder();
});

console.log('Bundle Builder initialized successfully!');
